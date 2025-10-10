# Integração do Schema Customizado com BetterAuth

## 📋 **Visão Geral**

O BetterAuth cria suas próprias tabelas de autenticação automaticamente via o componente `betterAuth`.
Nosso schema customizado em `schema.ts` tem uma tabela `users` que precisa ser integrada com os dados de autenticação.

---

## 🏗️ **Estrutura Atual**

### **BetterAuth Tables (Auto-criadas pelo componente)**
```typescript
// Criadas automaticamente pelo @convex-dev/better-auth
- betterAuth/users         // Dados de autenticação
- betterAuth/sessions      // Sessões ativas
- betterAuth/accounts      // Contas OAuth (Google, etc)
- betterAuth/verifications // Tokens de verificação
```

### **Schema Customizado**
```typescript
// schema.ts - Tabela customizada de usuários
users: defineTable({
  name: v.string(),
  email: v.string(),
  avatar: v.optional(v.string()),
  role: v.string(),
  department: v.string(),
  status: v.union(...),
  joinedAt: v.number(),
  lastActive: v.number(),
  skills: v.array(v.string()),
  projectIds: v.array(v.id("projects")),
})
```

---

## ⚠️ **PROBLEMA ATUAL**

**Duplicação de dados de usuário:**
- BetterAuth gerencia: `email`, `name`, `image` (avatar)
- Schema customizado também tem: `email`, `name`, `avatar`
- **Dados podem ficar desincronizados**

---

## ✅ **SOLUÇÃO RECOMENDADA**

### **Opção 1: Usar Apenas BetterAuth Users (Recomendado)**

Estender a tabela do BetterAuth com campos customizados:

```typescript
// auth.ts - Adicionar campos customizados ao BetterAuth
export const createAuth = (ctx, options) => {
  return betterAuth({
    // ... config atual

    // Adicionar campos customizados
    user: {
      additionalFields: {
        role: {
          type: "string",
          required: false,
          defaultValue: "member",
        },
        department: {
          type: "string",
          required: false,
        },
        status: {
          type: "string",
          required: false,
          defaultValue: "offline",
        },
        skills: {
          type: "array",
          required: false,
        },
        // ... outros campos
      },
    },
  });
};
```

**Vantagens:**
- ✅ Única fonte de verdade
- ✅ Sincronização automática
- ✅ Menos complexidade
- ✅ BetterAuth gerencia tudo

**Desvantagens:**
- ⚠️ Campos customizados ficam na tabela de auth
- ⚠️ Menos flexibilidade para relacionamentos complexos

---

### **Opção 2: Tabela Separada com Referência (Atual)**

Manter tabelas separadas e criar relação:

```typescript
// schema.ts - Modificado
export default defineSchema({
  // Dados de negócio do usuário
  userProfiles: defineTable({
    authUserId: v.string(), // ← Referência para betterAuth/users.id
    role: v.string(),
    department: v.string(),
    status: v.union(...),
    skills: v.array(v.string()),
    projectIds: v.array(v.id("projects")),
  }).index("by_auth_user", ["authUserId"]),

  // ... resto do schema
});
```

```typescript
// Criar mutation para sincronizar
export const createUserProfile = mutation({
  args: {
    authUserId: v.string(),
    role: v.string(),
    department: v.string(),
  },
  handler: async (ctx, args) => {
    // Criar perfil quando usuário se registrar
    await ctx.db.insert("userProfiles", {
      authUserId: args.authUserId,
      role: args.role || "member",
      department: args.department || "general",
      status: "offline",
      skills: [],
      projectIds: [],
    });
  },
});

// Hook no registro
export const createAuth = (ctx, options) => {
  return betterAuth({
    // ... config

    callbacks: {
      async onSignUp({ user }) {
        // Criar perfil customizado automaticamente
        await createUserProfile(ctx, {
          authUserId: user.id,
          role: "member",
          department: "general",
        });
      },
    },
  });
};
```

**Vantagens:**
- ✅ Separação de responsabilidades
- ✅ Schema mais limpo
- ✅ Flexibilidade para relacionamentos complexos

**Desvantagens:**
- ⚠️ Precisa sincronizar manualmente
- ⚠️ Mais complexo
- ⚠️ Possível desincronização

---

## 🛠️ **IMPLEMENTAÇÃO RECOMENDADA (Opção 2)**

### **1. Renomear tabela users para userProfiles**

```typescript
// schema.ts
export default defineSchema({
  userProfiles: defineTable({
    authUserId: v.string(), // ID do betterAuth/users
    role: v.string(),
    department: v.string(),
    status: v.union(
      v.literal("online"),
      v.literal("offline"),
      v.literal("away"),
      v.literal("busy")
    ),
    bio: v.optional(v.string()),
    location: v.optional(v.string()),
    website: v.optional(v.string()),
    skills: v.array(v.string()),
    projectIds: v.array(v.id("projects")),
  })
    .index("by_auth_user", ["authUserId"])
    .index("by_department", ["department"]),

  // ... resto das tabelas
});
```

### **2. Criar mutations de sincronização**

```typescript
// userProfiles.ts
export const createProfile = mutation({
  args: {
    authUserId: v.string(),
    role: v.optional(v.string()),
    department: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("userProfiles")
      .withIndex("by_auth_user", (q) => q.eq("authUserId", args.authUserId))
      .first();

    if (existing) {
      throw new Error("Profile already exists");
    }

    await ctx.db.insert("userProfiles", {
      authUserId: args.authUserId,
      role: args.role || "member",
      department: args.department || "general",
      status: "offline",
      skills: [],
      projectIds: [],
    });
  },
});

export const getProfile = query({
  args: { authUserId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("userProfiles")
      .withIndex("by_auth_user", (q) => q.eq("authUserId", args.authUserId))
      .first();
  },
});

export const updateProfile = mutation({
  args: {
    authUserId: v.string(),
    role: v.optional(v.string()),
    department: v.optional(v.string()),
    bio: v.optional(v.string()),
    // ... outros campos
  },
  handler: async (ctx, args) => {
    const profile = await ctx.db
      .query("userProfiles")
      .withIndex("by_auth_user", (q) => q.eq("authUserId", args.authUserId))
      .first();

    if (!profile) {
      throw new Error("Profile not found");
    }

    await ctx.db.patch(profile._id, {
      role: args.role,
      department: args.department,
      bio: args.bio,
    });
  },
});
```

### **3. Query combinada para dados completos**

```typescript
// auth.ts - Atualizar getCurrentUser
export const getCurrentUser = query({
  args: {},
  handler: async (ctx) => {
    const authUser = await authComponent.getAuthUser(ctx);

    if (!authUser) return null;

    // Buscar perfil customizado
    const profile = await ctx.db
      .query("userProfiles")
      .withIndex("by_auth_user", (q) => q.eq("authUserId", authUser.id))
      .first();

    // Combinar dados
    return {
      ...authUser,
      profile: profile || null,
    };
  },
});
```

### **4. Hook no registro para criar perfil**

```typescript
// auth.ts
export const createAuth = (ctx, options) => {
  return betterAuth({
    // ... config atual

    hooks: {
      after: [
        {
          matcher: () => true,
          handler: async ({ request, response }) => {
            if (request.url.includes("/signup")) {
              // Criar perfil após registro
              const user = response.user;
              if (user) {
                await createProfile(ctx, {
                  authUserId: user.id,
                });
              }
            }
          },
        },
      ],
    },
  });
};
```

---

## 📊 **Estrutura Final**

```
BetterAuth Tables (Auto)     Custom Tables (Manual)
┌─────────────────────┐     ┌──────────────────────┐
│ betterAuth/users    │────→│ userProfiles         │
│ - id                │     │ - authUserId (FK)    │
│ - email             │     │ - role               │
│ - name              │     │ - department         │
│ - image             │     │ - status             │
│ - emailVerified     │     │ - skills             │
│ - createdAt         │     │ - projectIds         │
└─────────────────────┘     └──────────────────────┘
         ↓
┌─────────────────────┐     ┌──────────────────────┐
│ betterAuth/sessions │     │ projects             │
│ - userId            │     │ - teamIds            │
│ - token             │     │ - ...                │
└─────────────────────┘     └──────────────────────┘
```

---

## 🚀 **Próximos Passos**

1. ✅ Decidir entre Opção 1 ou 2
2. ✅ Implementar sincronização (se Opção 2)
3. ✅ Migrar dados existentes (se houver)
4. ✅ Atualizar frontend para usar dados combinados
5. ✅ Testar criação/atualização de perfil

---

## 📝 **Notas Importantes**

- BetterAuth já gerencia `email`, `name`, `image` - não duplicar
- Sempre usar `authUser.id` como referência
- Criar perfil automaticamente no primeiro login/registro
- Validar que perfil existe antes de operações críticas
