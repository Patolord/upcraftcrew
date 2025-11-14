"use client";

import { Button } from "@/components/ui/button";

interface DeleteBudgetModalProps {
	isOpen: boolean;
	onClose: () => void;
	onConfirm: () => void;
	budgetTitle: string;
	isDeleting?: boolean;
}

export function DeleteBudgetModal({
	isOpen,
	onClose,
	onConfirm,
	budgetTitle,
	isDeleting = false,
}: DeleteBudgetModalProps) {
	if (!isOpen) return null;

	return (
		<div className="modal modal-open">
			<div className="modal-box">
				<div className="flex flex-col items-center text-center">
					{/* Icon */}
					<div className="bg-error/10 rounded-full p-4 mb-4">
						<span className="iconify lucide--trash-2 size-12 text-error" />
					</div>

					{/* Title */}
					<h3 className="font-bold text-xl mb-2">Excluir Orçamento?</h3>

					{/* Description */}
					<p className="text-base-content/70 mb-2">
						Tem certeza que deseja excluir o orçamento:
					</p>
					<p className="font-semibold text-lg mb-4">"{budgetTitle}"</p>

					{/* Warning */}
					<div className="alert alert-warning mb-6">
						<span className="iconify lucide--alert-triangle size-5" />
						<span className="text-sm">Esta ação não pode ser desfeita!</span>
					</div>

					{/* Actions */}
					<div className="flex text-white gap-3 w-full">
						<Button
							type="button"
							className="btn btn-ghost flex-1"
							onClick={onClose}
							disabled={isDeleting}
						>
							Cancelar
						</Button>
						<Button
							type="button"
							className="btn btn-error flex-1 text-white"
							onClick={onConfirm}
							disabled={isDeleting}
						>
							{isDeleting ? (
								<>
									<span className="loading loading-spinner loading-sm" />
									Excluindo...
								</>
							) : (
								<>
									<span className="iconify lucide--trash-2 size-4" />
									Excluir
								</>
							)}
						</Button>
					</div>
				</div>
			</div>
			<button
				type="button"
				className="modal-backdrop"
				onClick={onClose}
				disabled={isDeleting}
				aria-label="Close modal"
			/>
		</div>
	);
}
