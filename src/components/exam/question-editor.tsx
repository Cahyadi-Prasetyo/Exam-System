"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Plus, Trash2, Save, CheckCircle2, Image as ImageIcon, X, Loader2 } from "lucide-react";
import { updateQuestion, createOption, updateOption, deleteOption } from "@/actions/question-actions";
import { uploadImage } from "@/actions/upload-actions";
import { cn } from "@/lib/utils";

interface Option {
    id: string;
    text: string;
    isCorrect: boolean;
}

interface Question {
    id: string;
    examId: string;
    text: string;
    imageUrl?: string | null;
    type: string; // "MULTIPLE_CHOICE" | "ESSAY"
    options: Option[];
}

interface QuestionEditorProps {
    question: Question;
}

export function QuestionEditor({ question }: QuestionEditorProps) {
    const [text, setText] = useState(question.text);
    const [imageUrl, setImageUrl] = useState(question.imageUrl || "");
    const [type, setType] = useState(question.type);
    const [isSaving, setIsSaving] = useState(false);
    const [lastSaved, setLastSaved] = useState<Date | null>(null);
    const [showImageInput, setShowImageInput] = useState(!!question.imageUrl);
    const [isUploading, setIsUploading] = useState(false);

    // Update local state when prop changes
    useEffect(() => {
        setText(question.text);
        setImageUrl(question.imageUrl || "");
        setShowImageInput(!!question.imageUrl);
        setType(question.type);
    }, [question.id]);

    // Debounced Save for Text
    useEffect(() => {
        const timer = setTimeout(async () => {
            if (text !== question.text) {
                setIsSaving(true);
                await updateQuestion(question.id, { text });
                setIsSaving(false);
                setLastSaved(new Date());
            }
        }, 1000);

        return () => clearTimeout(timer);
    }, [text, question.id]);

    const handleTypeChange = async (value: string) => {
        setType(value);
        setIsSaving(true);
        await updateQuestion(question.id, { type: value as "MULTIPLE_CHOICE" | "ESSAY" });
        setIsSaving(false);
        setLastSaved(new Date());
    };

    const handleAddOption = async () => {
        setIsSaving(true);
        await createOption(question.id, question.examId);
        setIsSaving(false);
    };

    const handleOptionTextChange = async (optionId: string, newText: string) => {
        await updateOption(optionId, question.examId, { text: newText });
    };

    const handleCorrectOptionChange = async (optionId: string) => {
        setIsSaving(true);
        await updateOption(optionId, question.examId, { isCorrect: true });
        setIsSaving(false);
    };

    const handleDeleteOption = async (optionId: string) => {
        if (confirm("Hapus opsi ini?")) {
            setIsSaving(true);
            await deleteOption(optionId, question.examId);
            setIsSaving(false);
        }
    };

    const handleImageSave = async (url: string | null) => {
        setIsSaving(true);
        await updateQuestion(question.id, { imageUrl: url });
        setIsSaving(false);
        setLastSaved(new Date());
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsUploading(true);
        const formData = new FormData();
        formData.append("file", file);

        const res = await uploadImage(formData);
        if (res.success && res.url) {
            setImageUrl(res.url);
            await handleImageSave(res.url);
        } else {
            alert("Gagal mengupload gambar");
        }
        setIsUploading(false);
    };

    return (
        <div className="flex-1 h-full overflow-y-auto p-6 md:p-10 bg-gray-50/30">
            <div className="max-w-3xl mx-auto space-y-8">
                {/* Header / Status */}
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold text-gray-900">Edit Soal</h1>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                        {isSaving ? (
                            <span className="flex items-center gap-1 text-indigo-600">
                                <Save className="w-4 h-4 animate-pulse" />
                                Menyimpan...
                            </span>
                        ) : lastSaved ? (
                            <span className="flex items-center gap-1 text-green-600">
                                <CheckCircle2 className="w-4 h-4" />
                                Tersimpan {lastSaved.toLocaleTimeString()}
                            </span>
                        ) : null}
                    </div>
                </div>

                {/* Question Type */}
                <div className="space-y-3">
                    <Label>Tipe Soal</Label>
                    <Select value={type} onValueChange={handleTypeChange}>
                        <SelectTrigger className="w-[200px] bg-white">
                            <SelectValue placeholder="Pilih tipe" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="MULTIPLE_CHOICE">Pilihan Ganda</SelectItem>
                            <SelectItem value="ESSAY">Essay</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {/* Question Text & Image */}
                <div className="space-y-3">
                    <Label>Pertanyaan</Label>
                    <div className="relative">
                        <Textarea
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                            placeholder="Tulis pertanyaan di sini..."
                            className="min-h-[150px] text-base p-4 bg-white shadow-sm border-gray-200 focus:border-indigo-500 transition-all pb-12"
                        />

                        {/* Toolbar inside textarea */}
                        <div className="absolute bottom-3 left-3 flex gap-2">
                            {!showImageInput && (
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-8 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 gap-2"
                                    onClick={() => setShowImageInput(true)}
                                >
                                    <ImageIcon className="w-4 h-4" />
                                    <span className="text-xs">Tambah Gambar</span>
                                </Button>
                            )}
                        </div>
                    </div>

                    {/* Image Input Section */}
                    {showImageInput && (
                        <div className="p-4 bg-white rounded-lg border border-gray-200 shadow-sm animate-in fade-in slide-in-from-top-2">
                            <div className="flex items-center justify-between mb-3">
                                <Label className="text-xs text-gray-500">Upload Gambar</Label>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-6 w-6 text-gray-400 hover:text-red-500"
                                    onClick={() => {
                                        setShowImageInput(false);
                                        setImageUrl("");
                                        handleImageSave(null);
                                    }}
                                >
                                    <X className="w-4 h-4" />
                                </Button>
                            </div>

                            <div className="flex gap-2 items-center">
                                <Input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageUpload}
                                    disabled={isUploading}
                                    className="bg-gray-50 text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                                />
                                {isUploading && <Loader2 className="w-4 h-4 animate-spin text-indigo-600" />}
                            </div>

                            {imageUrl && (
                                <div className="mt-3 relative w-full h-64 bg-gray-100 rounded-lg overflow-hidden border border-gray-200 group">
                                    <img
                                        src={imageUrl}
                                        alt="Preview Soal"
                                        className="w-full h-full object-contain"
                                        onError={(e) => {
                                            (e.target as HTMLImageElement).src = "https://placehold.co/600x400?text=Gambar+Tidak+Ditemukan";
                                        }}
                                    />
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Options (Only for Multiple Choice) */}
                {type === "MULTIPLE_CHOICE" && (
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <Label>Pilihan Jawaban</Label>
                            <Button onClick={handleAddOption} size="sm" variant="outline" className="gap-2">
                                <Plus className="w-4 h-4" />
                                Tambah Opsi
                            </Button>
                        </div>

                        <div className="space-y-3">
                            <RadioGroup
                                value={question.options.find(o => o.isCorrect)?.id}
                                onValueChange={handleCorrectOptionChange}
                            >
                                {question.options.map((option, index) => (
                                    <div key={option.id} className="flex items-center gap-3 group">
                                        <div className="flex items-center justify-center pt-2">
                                            <RadioGroupItem value={option.id} id={option.id} />
                                        </div>

                                        <div className="flex-1">
                                            <Input
                                                defaultValue={option.text}
                                                onBlur={(e) => handleOptionTextChange(option.id, e.target.value)}
                                                className={cn(
                                                    "bg-white",
                                                    option.isCorrect && "border-indigo-500 ring-1 ring-indigo-500 bg-indigo-50/30"
                                                )}
                                                placeholder={`Opsi ${index + 1}`}
                                            />
                                        </div>

                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => handleDeleteOption(option.id)}
                                            className="text-gray-400 hover:text-red-600 hover:bg-red-50"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    </div>
                                ))}
                            </RadioGroup>

                            {question.options.length === 0 && (
                                <div className="text-center py-8 border-2 border-dashed border-gray-200 rounded-lg">
                                    <p className="text-sm text-gray-500">Belum ada pilihan jawaban.</p>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
