"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { joinExam } from "@/actions/student-actions";
import { Loader2, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

const schema = z.object({
    token: z.string().min(6, "Token harus 6 karakter").max(6, "Token harus 6 karakter"),
});

type FormData = z.infer<typeof schema>;

export function JoinExamForm() {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<FormData>({
        resolver: zodResolver(schema),
    });

    const onSubmit = async (data: FormData) => {
        setIsLoading(true);
        setError(null);

        const formData = new FormData();
        formData.append("token", data.token.toUpperCase());

        const res = await joinExam(null, formData);

        if (res?.error) {
            setError(res.error);
            setIsLoading(false);
        }
        // If success, server action handles redirect
    };

    return (
        <div className="w-full max-w-md mx-auto">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="space-y-2">
                    <label htmlFor="token" className="text-sm font-medium text-foreground">
                        Kode Token Ujian
                    </label>
                    <div className="relative">
                        <Input
                            id="token"
                            {...register("token")}
                            placeholder="Contoh: A1B2C3"
                            className="uppercase tracking-widest text-center text-lg h-12 font-bold"
                            maxLength={6}
                        />
                    </div>
                    {errors.token && (
                        <p className="text-sm text-red-500">{errors.token.message}</p>
                    )}
                </div>

                {error && (
                    <div className="p-3 rounded-md bg-red-50 border border-red-200 text-sm text-red-600">
                        {error}
                    </div>
                )}

                <Button
                    type="submit"
                    className="w-full h-12 text-base font-semibold bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/20 transition-all hover:scale-[1.02]"
                    disabled={isLoading}
                >
                    {isLoading ? (
                        <>
                            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                            Memproses...
                        </>
                    ) : (
                        <>
                            Masuk Ujian
                            <ArrowRight className="w-5 h-5 ml-2" />
                        </>
                    )}
                </Button>
            </form>
        </div>
    );
}
