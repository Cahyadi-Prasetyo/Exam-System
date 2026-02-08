"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useState, useRef } from "react";
import { importUsers } from "@/actions/import-users-action";
import { getClasses } from "@/actions/class-subject-actions";
import {
    Upload,
    FileSpreadsheet,
    FileJson,
    Download,
    AlertCircle,
    CheckCircle2,
    Loader2,
    X
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import * as XLSX from "xlsx";

interface ClassData {
    id: string;
    name: string;
}

interface ImportUserModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

interface ParsedUser {
    name: string;
    email: string;
    role: "STUDENT" | "TEACHER" | "ADMIN";
    password?: string;
    classId?: string;
    className?: string;
}

export function ImportUserModal({ isOpen, onClose, onSuccess }: ImportUserModalProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [file, setFile] = useState<File | null>(null);
    const [parsedData, setParsedData] = useState<ParsedUser[]>([]);
    const [classes, setClasses] = useState<ClassData[]>([]);
    const [importResult, setImportResult] = useState<any>(null);
    const [step, setStep] = useState<"upload" | "preview" | "result">("upload");
    const fileInputRef = useRef<HTMLInputElement>(null);
    const { toast } = useToast();

    const fetchClasses = async () => {
        const data = await getClasses();
        setClasses(data as ClassData[]);
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (!selectedFile) return;

        setFile(selectedFile);
        await fetchClasses();

        const fileExtension = selectedFile.name.split('.').pop()?.toLowerCase();

        if (fileExtension === 'json') {
            await parseJSON(selectedFile);
        } else if (fileExtension === 'xlsx' || fileExtension === 'xls') {
            await parseExcel(selectedFile);
        } else {
            toast({
                title: "Format tidak didukung",
                description: "Gunakan file .xlsx, .xls, atau .json",
                variant: "destructive"
            });
        }
    };

    const parseJSON = async (file: File) => {
        try {
            const text = await file.text();
            const data = JSON.parse(text);
            const users = Array.isArray(data) ? data : data.users || [];
            setParsedData(users);
            setStep("preview");
        } catch (error) {
            toast({
                title: "Error parsing JSON",
                description: "Format JSON tidak valid",
                variant: "destructive"
            });
        }
    };

    const parseExcel = async (file: File) => {
        try {
            const buffer = await file.arrayBuffer();
            const workbook = XLSX.read(buffer, { type: 'array' });
            const sheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[sheetName];
            const jsonData = XLSX.utils.sheet_to_json(worksheet);

            const users: ParsedUser[] = jsonData.map((row: any) => ({
                name: row.name || row.nama || row.Name || "",
                email: row.email || row.Email || "",
                role: (row.role || row.Role || "STUDENT").toUpperCase() as any,
                password: row.password || row.Password || "",
                className: row.class || row.kelas || row.Class || "",
            }));

            // Map class names to IDs
            users.forEach(user => {
                if (user.className) {
                    const foundClass = classes.find(c =>
                        c.name.toLowerCase() === user.className?.toLowerCase()
                    );
                    if (foundClass) {
                        user.classId = foundClass.id;
                    }
                }
            });

            setParsedData(users);
            setStep("preview");
        } catch (error) {
            toast({
                title: "Error parsing Excel",
                description: "Gagal membaca file Excel",
                variant: "destructive"
            });
        }
    };

    const handleImport = async () => {
        setIsLoading(true);
        try {
            const result = await importUsers(parsedData);
            setImportResult(result);
            setStep("result");

            if (result.successCount > 0) {
                onSuccess();
            }
        } catch (error) {
            toast({
                title: "Import gagal",
                description: "Terjadi kesalahan saat import",
                variant: "destructive"
            });
        } finally {
            setIsLoading(false);
        }
    };

    const downloadTemplate = (format: 'excel' | 'json') => {
        const templateData = [
            { name: "Budi Santoso", email: "budi@example.com", role: "STUDENT", password: "password123", class: "X-IPA-1" },
            { name: "Ani Wijaya", email: "ani@example.com", role: "TEACHER", password: "teacher123", class: "" },
            { name: "Admin Baru", email: "admin@example.com", role: "ADMIN", password: "admin123", class: "" },
        ];

        if (format === 'json') {
            const blob = new Blob([JSON.stringify(templateData, null, 2)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'template_import_users.json';
            a.click();
        } else {
            const worksheet = XLSX.utils.json_to_sheet(templateData);
            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, "Users");
            XLSX.writeFile(workbook, "template_import_users.xlsx");
        }
    };

    const resetModal = () => {
        setFile(null);
        setParsedData([]);
        setImportResult(null);
        setStep("upload");
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    const handleClose = () => {
        resetModal();
        onClose();
    };

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto p-0">
                {/* Header */}
                <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 p-6 text-white rounded-t-lg">
                    <DialogHeader>
                        <DialogTitle className="text-white flex items-center gap-2 text-xl">
                            <Upload className="w-6 h-6" />
                            Import Users dari File
                        </DialogTitle>
                        <p className="text-white/80 text-sm mt-1">
                            Upload file Excel (.xlsx) atau JSON untuk import banyak user sekaligus
                        </p>
                    </DialogHeader>
                </div>

                <div className="p-6">
                    {/* Step 1: Upload */}
                    {step === "upload" && (
                        <div className="space-y-6">
                            {/* Download Template */}
                            <div className="bg-muted/50 p-4 rounded-lg">
                                <h3 className="font-medium mb-2">📥 Download Template</h3>
                                <p className="text-sm text-muted-foreground mb-3">
                                    Download template untuk melihat format yang benar
                                </p>
                                <div className="flex gap-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => downloadTemplate('excel')}
                                    >
                                        <FileSpreadsheet className="w-4 h-4 mr-2" />
                                        Template Excel
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => downloadTemplate('json')}
                                    >
                                        <FileJson className="w-4 h-4 mr-2" />
                                        Template JSON
                                    </Button>
                                </div>
                            </div>

                            {/* Upload Area */}
                            <div
                                className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary/50 transition-colors cursor-pointer"
                                onClick={() => fileInputRef.current?.click()}
                            >
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept=".xlsx,.xls,.json"
                                    onChange={handleFileChange}
                                    className="hidden"
                                />
                                <Upload className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                                <p className="font-medium">Klik atau drag file ke sini</p>
                                <p className="text-sm text-muted-foreground mt-1">
                                    Format: .xlsx, .xls, .json
                                </p>
                            </div>

                            {/* Format Info */}
                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <div className="bg-blue-50 dark:bg-blue-950/30 p-3 rounded-lg">
                                    <h4 className="font-medium text-blue-700 dark:text-blue-300 mb-1">Kolom Wajib</h4>
                                    <ul className="text-muted-foreground space-y-0.5">
                                        <li>• <code>name</code> - Nama lengkap</li>
                                        <li>• <code>email</code> - Email unik</li>
                                    </ul>
                                </div>
                                <div className="bg-purple-50 dark:bg-purple-950/30 p-3 rounded-lg">
                                    <h4 className="font-medium text-purple-700 dark:text-purple-300 mb-1">Kolom Opsional</h4>
                                    <ul className="text-muted-foreground space-y-0.5">
                                        <li>• <code>role</code> - STUDENT/TEACHER/ADMIN</li>
                                        <li>• <code>password</code> - Default: password123</li>
                                        <li>• <code>class</code> - Nama kelas (untuk siswa)</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Step 2: Preview */}
                    {step === "preview" && (
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <h3 className="font-medium">
                                    Preview Data ({parsedData.length} user)
                                </h3>
                                <Button variant="ghost" size="sm" onClick={resetModal}>
                                    <X className="w-4 h-4 mr-1" /> Ganti File
                                </Button>
                            </div>

                            <div className="max-h-64 overflow-y-auto border rounded-lg">
                                <table className="w-full text-sm">
                                    <thead className="bg-muted sticky top-0">
                                        <tr>
                                            <th className="px-3 py-2 text-left">#</th>
                                            <th className="px-3 py-2 text-left">Nama</th>
                                            <th className="px-3 py-2 text-left">Email</th>
                                            <th className="px-3 py-2 text-left">Role</th>
                                            <th className="px-3 py-2 text-left">Kelas</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y">
                                        {parsedData.map((user, i) => (
                                            <tr key={i} className="hover:bg-muted/50">
                                                <td className="px-3 py-2">{i + 1}</td>
                                                <td className="px-3 py-2">{user.name || <span className="text-red-500">-</span>}</td>
                                                <td className="px-3 py-2">{user.email || <span className="text-red-500">-</span>}</td>
                                                <td className="px-3 py-2">
                                                    <span className={`px-2 py-0.5 rounded text-xs ${user.role === "ADMIN" ? "bg-red-100 text-red-700" :
                                                            user.role === "TEACHER" ? "bg-purple-100 text-purple-700" :
                                                                "bg-blue-100 text-blue-700"
                                                        }`}>
                                                        {user.role}
                                                    </span>
                                                </td>
                                                <td className="px-3 py-2">{user.className || "-"}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            <DialogFooter className="gap-2">
                                <Button variant="ghost" onClick={handleClose}>Batal</Button>
                                <Button
                                    onClick={handleImport}
                                    disabled={isLoading || parsedData.length === 0}
                                    className="bg-gradient-to-r from-emerald-500 to-emerald-600 hover:opacity-90"
                                >
                                    {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                                    Import {parsedData.length} User
                                </Button>
                            </DialogFooter>
                        </div>
                    )}

                    {/* Step 3: Result */}
                    {step === "result" && importResult && (
                        <div className="space-y-4">
                            {/* Summary */}
                            <div className={`p-4 rounded-lg flex items-start gap-3 ${importResult.errorCount === 0
                                    ? "bg-green-50 dark:bg-green-950/30"
                                    : "bg-amber-50 dark:bg-amber-950/30"
                                }`}>
                                {importResult.errorCount === 0 ? (
                                    <CheckCircle2 className="w-6 h-6 text-green-600 shrink-0" />
                                ) : (
                                    <AlertCircle className="w-6 h-6 text-amber-600 shrink-0" />
                                )}
                                <div>
                                    <h3 className="font-medium">
                                        {importResult.errorCount === 0
                                            ? "Import Berhasil!"
                                            : "Import Selesai dengan Error"
                                        }
                                    </h3>
                                    <p className="text-sm text-muted-foreground mt-1">
                                        ✅ {importResult.successCount} berhasil &nbsp;|&nbsp;
                                        ❌ {importResult.errorCount} gagal &nbsp;|&nbsp;
                                        📊 Total: {importResult.totalRows}
                                    </p>
                                </div>
                            </div>

                            {/* Errors */}
                            {importResult.errors.length > 0 && (
                                <div>
                                    <h4 className="font-medium text-sm mb-2">Detail Error:</h4>
                                    <div className="max-h-40 overflow-y-auto border rounded-lg divide-y text-sm">
                                        {importResult.errors.map((err: any, i: number) => (
                                            <div key={i} className="px-3 py-2 flex gap-3">
                                                <span className="text-muted-foreground">Row {err.row}</span>
                                                <span className="font-medium">{err.email}</span>
                                                <span className="text-red-500">{err.error}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <DialogFooter>
                                <Button onClick={handleClose}>
                                    Tutup
                                </Button>
                            </DialogFooter>
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}
