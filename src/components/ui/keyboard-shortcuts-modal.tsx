"use client";

import { Modal } from "./modal";
import { Button } from "./button";

interface KeyboardShortcutsModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function KeyboardShortcutsModal({ isOpen, onClose }: KeyboardShortcutsModalProps) {
    const shortcuts = [
        {
            category: "Pilih Jawaban",
            items: [
                { keys: ["A", "B", "C", "D", "E"], description: "Pilih opsi jawaban" },
            ],
        },
        {
            category: "Navigasi",
            items: [
                { keys: ["→", "↓"], description: "Soal selanjutnya" },
                { keys: ["←", "↑"], description: "Soal sebelumnya" },
                { keys: ["Space"], description: "Soal selanjutnya" },
            ],
        },
        {
            category: "Aksi",
            items: [
                { keys: ["F"], description: "Tandai/lepas tanda soal" },
                { keys: ["?"], description: "Tampilkan bantuan ini" },
            ],
        },
    ];

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="⌨️ Keyboard Shortcuts">
            <div className="space-y-6">
                <p className="text-sm text-muted-foreground">
                    Gunakan keyboard shortcuts untuk navigasi lebih cepat saat ujian
                </p>

                {shortcuts.map((section) => (
                    <div key={section.category}>
                        <h3 className="font-semibold text-sm mb-3 text-primary">
                            {section.category}
                        </h3>
                        <div className="space-y-2">
                            {section.items.map((item, idx) => (
                                <div
                                    key={idx}
                                    className="flex items-center justify-between p-2 rounded bg-muted/50"
                                >
                                    <span className="text-sm">{item.description}</span>
                                    <div className="flex gap-1">
                                        {item.keys.map((key) => (
                                            <kbd
                                                key={key}
                                                className="px-2 py-1 text-xs font-semibold bg-background border border-border rounded shadow-sm"
                                            >
                                                {key}
                                            </kbd>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}

                <div className="pt-4 border-t border-border">
                    <Button onClick={onClose} className="w-full">
                        Tutup
                    </Button>
                </div>
            </div>
        </Modal>
    );
}
