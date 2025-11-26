import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ExamResult } from "@/lib/mock-teacher-data";
import { useState, useEffect } from "react";

interface GradeAdjustmentModalProps {
    result: ExamResult | null;
    isOpen: boolean;
    onClose: () => void;
    onSave: (id: string, adjustment: number, bonus: number, reason: string) => void;
}

export function GradeAdjustmentModal({
    result,
    isOpen,
    onClose,
    onSave,
}: GradeAdjustmentModalProps) {
    const [adjustment, setAdjustment] = useState(0);
    const [bonus, setBonus] = useState(0);
    const [reason, setReason] = useState("");

    useEffect(() => {
        if (result) {
            setAdjustment(result.manualAdjustment || 0);
            setBonus(result.bonusPoints || 0);
            setReason(result.adjustmentReason || "");
        }
    }, [result]);

    if (!result) return null;

    const finalScore = Math.min(
        result.maxScore,
        Math.max(0, result.originalScore + adjustment + bonus)
    );

    const handleSave = () => {
        onSave(result.id, adjustment, bonus, reason);
        onClose();
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Sesuaikan Nilai</DialogTitle>
                </DialogHeader>

                <div className="space-y-6 py-4">
                    {/* Score Summary */}
                    <div className="bg-muted/50 p-4 rounded-lg flex items-center justify-between">
                        <div>
                            <p className="text-sm text-muted-foreground">Nilai Akhir</p>
                            <p className="text-3xl font-bold text-primary">{finalScore}</p>
                        </div>
                        <div className="text-right text-sm">
                            <p className="text-muted-foreground">Original: {result.originalScore}</p>
                            <p className="text-muted-foreground">Max: {result.maxScore}</p>
                        </div>
                    </div>

                    {/* Adjustment Inputs */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Penyesuaian Manual</label>
                            <input
                                type="number"
                                className="w-full p-2 text-sm border rounded-md bg-background"
                                value={adjustment}
                                onChange={(e) => setAdjustment(Number(e.target.value))}
                                placeholder="0"
                            />
                            <p className="text-xs text-muted-foreground">Bisa negatif (misal: -5)</p>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Bonus Poin</label>
                            <input
                                type="number"
                                className="w-full p-2 text-sm border rounded-md bg-background"
                                value={bonus}
                                onChange={(e) => setBonus(Math.max(0, Number(e.target.value)))}
                                placeholder="0"
                                min="0"
                            />
                            <p className="text-xs text-muted-foreground">Hanya positif</p>
                        </div>
                    </div>

                    {/* Reason Input */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Alasan Penyesuaian <span className="text-red-500">*</span></label>
                        <textarea
                            className="w-full min-h-[80px] p-2 text-sm border rounded-md bg-background"
                            placeholder="Jelaskan alasan perubahan nilai..."
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                        />
                    </div>
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={onClose}>
                        Batal
                    </Button>
                    <Button
                        onClick={handleSave}
                        disabled={!reason && (adjustment !== 0 || bonus !== 0)}
                    >
                        Simpan Perubahan
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
