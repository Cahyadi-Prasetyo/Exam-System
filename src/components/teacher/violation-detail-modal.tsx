import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Violation } from "@/lib/mock-teacher-data";
import { useState } from "react";

interface ViolationDetailModalProps {
    violation: Violation | null;
    isOpen: boolean;
    onClose: () => void;
    onUpdateStatus: (id: string, status: "verified" | "dismissed", notes?: string) => void;
}

export function ViolationDetailModal({
    violation,
    isOpen,
    onClose,
    onUpdateStatus,
}: ViolationDetailModalProps) {
    const [notes, setNotes] = useState("");

    if (!violation) return null;

    const handleAction = (status: "verified" | "dismissed") => {
        onUpdateStatus(violation.id, status, notes);
        setNotes("");
        onClose();
    };

    const typeConfig = {
        tab_switch: { label: "Pindah Tab", color: "text-amber-600 dark:text-amber-400" },
        right_click: { label: "Klik Kanan", color: "text-rose-600 dark:text-rose-400" },
        copy_paste: { label: "Copy Paste", color: "text-purple-600 dark:text-purple-400" },
    };

    const config = typeConfig[violation.type] || { label: violation.type, color: "text-gray-600" };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Detail Pelanggaran</DialogTitle>
                </DialogHeader>

                <div className="space-y-4 py-4">
                    {/* Student Info */}
                    <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                            <p className="text-muted-foreground">Siswa</p>
                            <p className="font-medium">{violation.studentName}</p>
                        </div>
                        <div>
                            <p className="text-muted-foreground">Waktu</p>
                            <p className="font-medium">
                                {new Date(violation.timestamp).toLocaleString("id-ID")}
                            </p>
                        </div>
                        <div className="col-span-2">
                            <p className="text-muted-foreground">Ujian</p>
                            <p className="font-medium">{violation.examTitle}</p>
                        </div>
                    </div>

                    {/* Violation Type */}
                    <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">Jenis:</span>
                        <span className={`font-medium ${config.color}`}>
                            {config.label}
                        </span>
                    </div>

                    {/* Evidence Section */}
                    <div className="bg-muted/50 p-4 rounded-lg space-y-2">
                        <h4 className="text-sm font-semibold mb-2">Bukti Pelanggaran</h4>

                        {violation.type === 'tab_switch' && violation.evidence?.duration && (
                            <div className="text-sm">
                                <span className="text-muted-foreground">Durasi meninggalkan ujian:</span>
                                <span className="ml-2 font-mono font-bold text-red-600">
                                    {violation.evidence.duration} detik
                                </span>
                            </div>
                        )}

                        {violation.type === 'copy_paste' && violation.evidence?.content && (
                            <div className="space-y-1">
                                <p className="text-sm text-muted-foreground">Konten yang disalin:</p>
                                <div className="p-2 bg-background border rounded text-xs font-mono break-all">
                                    {violation.evidence.content}
                                </div>
                            </div>
                        )}

                        {violation.type === 'right_click' && (
                            <p className="text-sm text-muted-foreground">
                                Terdeteksi melakukan klik kanan pada area ujian.
                            </p>
                        )}
                    </div>

                    {/* Notes Section */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Catatan Guru (Opsional)</label>
                        <textarea
                            className="w-full min-h-[80px] p-2 text-sm border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                            placeholder="Tambahkan catatan..."
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                        />
                    </div>
                </div>

                <DialogFooter className="flex gap-2 sm:justify-end">
                    <Button
                        variant="outline"
                        onClick={() => handleAction("dismissed")}
                        className="flex-1 sm:flex-none"
                    >
                        Abaikan
                    </Button>
                    <Button
                        variant="destructive"
                        onClick={() => handleAction("verified")}
                        className="flex-1 sm:flex-none"
                    >
                        Verifikasi
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
