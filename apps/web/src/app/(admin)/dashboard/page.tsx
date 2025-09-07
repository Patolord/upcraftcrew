"use client";

import { api } from "@upcraftcrew-os/backend";
import { useQuery } from "convex/react";


interface Todo {
	_id: string;
	text: string;
	completed: boolean;
}

const StarterPage = () => {
	const todos = useQuery(api.todos.getAll);

	if (todos === undefined) {
		return (
			<div className="p-6">
				<h1 className="text-2xl font-bold mb-4">Dashboard - Todos</h1>
				<p>Loading todos...</p>
			</div>
		);
	}

	return (
		<div className="p-6">
			<h1 className="text-2xl font-bold mb-4">Dashboard - Todos</h1>
			<div className="space-y-4">
				{todos.length === 0 ? (
					<p className="text-gray-500">No todos found. Create some todos in Convex!</p>
				) : (
					<ul className="space-y-2">
						{todos.map((todo: Todo) => (
							<li
								key={todo._id}
								className={`p-3 border rounded-lg ${
									todo.completed 
										? "bg-green-50 border-green-200 text-green-800" 
										: "bg-gray-50 border-gray-200"
								}`}
							>
								<div className="flex items-center justify-between">
									<span className={todo.completed ? "line-through" : ""}>
										{todo.text}
									</span>
									<span className={`px-2 py-1 text-xs rounded ${
										todo.completed 
											? "bg-green-100 text-green-700" 
											: "bg-yellow-100 text-yellow-700"
									}`}>
										{todo.completed ? "Completed" : "Pending"}
									</span>
								</div>
							</li>
						))}
					</ul>
				)}
			</div>
		</div>
	);
};

export default StarterPage;
