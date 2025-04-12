'use client';

import React, { createContext, useContext, useState } from 'react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { useEffect } from 'react';

interface ConfirmDialogContextType {
	showDialog: (question: string, onConfirm: () => void) => void;
}

const ConfirmDialogContext = createContext<ConfirmDialogContextType | undefined>(undefined);

export const useConfirmDialog = () => {
	const context = useContext(ConfirmDialogContext);
	if (!context) {
		throw new Error('useConfirmDialog must be used within a ConfirmDialogProvider');
	}
	return context;
};

export const ConfirmDialogProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
	const [isOpen, setIsOpen] = useState(false);
	const [question, setQuestion] = useState('');
	const [onConfirmCallback, setOnConfirmCallback] = useState<() => void>(() => {});

	useEffect(() => {
    if (!isOpen) {
      document.body.style.pointerEvents = '';
    }
  }, [isOpen]);

	const showDialog = (question: string, onConfirm: () => void) => {
		setQuestion(question);
		setOnConfirmCallback(() => onConfirm);
		setIsOpen(true);
	};

	const handleConfirm = () => {
		onConfirmCallback();
		document.body.style.pointerEvents = '';
		setIsOpen(false);
	};

	return (
		<ConfirmDialogContext.Provider value={{ showDialog }}>
			{children}
			<AlertDialog open={isOpen} onOpenChange={setIsOpen}>
				<AlertDialogContent className="w-[400px]">
					<AlertDialogHeader>
						<AlertDialogTitle>Подтверждение действия</AlertDialogTitle>
						<AlertDialogDescription className="text-black">{question}</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel>Отмена</AlertDialogCancel>
						<AlertDialogAction onClick={handleConfirm}>Подтвердить</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</ConfirmDialogContext.Provider>
	);
};
