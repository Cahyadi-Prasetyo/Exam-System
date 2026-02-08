"use client";

import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export interface StudentExamResult {
    examTitle: string;
    date: string;
    score: number;
    totalQuestions: number;
    correctAnswers: number;
    duration: string;
    rank?: number;
    totalParticipants?: number;
}

export interface StudentReportData {
    studentName: string;
    studentId: string;
    className: string;
    semester: string;
    academicYear: string;
    photoUrl?: string;
    examResults: StudentExamResult[];
    averageScore: number;
    highestScore: number;
    lowestScore: number;
    totalExams: number;
    teacherName?: string;
    notes?: string;
}

export function generateStudentReportCard(data: StudentReportData): void {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 20;

    // Header with gradient effect (simulated with rectangles)
    doc.setFillColor(79, 70, 229); // Indigo-600
    doc.rect(0, 0, pageWidth, 45, "F");

    doc.setFillColor(99, 102, 241); // Lighter accent
    doc.rect(0, 40, pageWidth, 10, "F");

    // School/App Name
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(24);
    doc.setFont("helvetica", "bold");
    doc.text("EXAM SYSTEM", pageWidth / 2, 20, { align: "center" });

    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    doc.text("Laporan Hasil Ujian Siswa", pageWidth / 2, 32, { align: "center" });

    // Reset colors for body
    doc.setTextColor(0, 0, 0);

    // Student Info Box
    let yPos = 60;

    doc.setFillColor(249, 250, 251); // Gray-50
    doc.roundedRect(margin, yPos, pageWidth - (margin * 2), 45, 3, 3, "F");

    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.text("INFORMASI SISWA", margin + 5, yPos + 10);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);

    const leftCol = margin + 5;
    const rightCol = pageWidth / 2 + 10;

    doc.text(`Nama Lengkap: ${data.studentName}`, leftCol, yPos + 22);
    doc.text(`NIS/ID: ${data.studentId}`, leftCol, yPos + 32);
    doc.text(`Kelas: ${data.className}`, leftCol, yPos + 42);

    doc.text(`Semester: ${data.semester}`, rightCol, yPos + 22);
    doc.text(`Tahun Ajaran: ${data.academicYear}`, rightCol, yPos + 32);
    doc.text(`Total Ujian: ${data.totalExams}`, rightCol, yPos + 42);

    yPos += 55;

    // Statistics Cards
    const cardWidth = (pageWidth - margin * 2 - 15) / 4;
    const stats = [
        { label: "Rata-rata", value: data.averageScore.toFixed(1), color: [79, 70, 229] }, // Indigo
        { label: "Tertinggi", value: data.highestScore.toString(), color: [34, 197, 94] }, // Green
        { label: "Terendah", value: data.lowestScore.toString(), color: [239, 68, 68] }, // Red
        { label: "Total Ujian", value: data.totalExams.toString(), color: [59, 130, 246] }, // Blue
    ];

    stats.forEach((stat, idx) => {
        const x = margin + (cardWidth + 5) * idx;
        doc.setFillColor(stat.color[0], stat.color[1], stat.color[2]);
        doc.roundedRect(x, yPos, cardWidth, 25, 2, 2, "F");

        doc.setTextColor(255, 255, 255);
        doc.setFontSize(14);
        doc.setFont("helvetica", "bold");
        doc.text(stat.value, x + cardWidth / 2, yPos + 12, { align: "center" });

        doc.setFontSize(8);
        doc.setFont("helvetica", "normal");
        doc.text(stat.label, x + cardWidth / 2, yPos + 20, { align: "center" });
    });

    doc.setTextColor(0, 0, 0);
    yPos += 35;

    // Results Table
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("RINCIAN HASIL UJIAN", margin, yPos);
    yPos += 5;

    const tableData = data.examResults.map((result, idx) => [
        (idx + 1).toString(),
        result.examTitle,
        result.date,
        `${result.correctAnswers}/${result.totalQuestions}`,
        result.score.toString(),
        getGrade(result.score),
    ]);

    autoTable(doc, {
        startY: yPos,
        head: [["No", "Nama Ujian", "Tanggal", "Benar/Total", "Nilai", "Grade"]],
        body: tableData,
        theme: "striped",
        headStyles: {
            fillColor: [79, 70, 229],
            textColor: [255, 255, 255],
            fontStyle: "bold",
            halign: "center",
        },
        bodyStyles: {
            halign: "center",
            fontSize: 9,
        },
        columnStyles: {
            0: { cellWidth: 12 },
            1: { cellWidth: 50, halign: "left" },
            2: { cellWidth: 25 },
            3: { cellWidth: 25 },
            4: { cellWidth: 20 },
            5: { cellWidth: 20 },
        },
        margin: { left: margin, right: margin },
        didDrawCell: (data) => {
            // Color code grades
            if (data.column.index === 5 && data.section === "body") {
                const grade = data.cell.text[0];
                let color: number[] = [0, 0, 0];
                if (grade === "A") color = [34, 197, 94];
                else if (grade === "B") color = [59, 130, 246];
                else if (grade === "C") color = [234, 179, 8];
                else if (grade === "D") color = [249, 115, 22];
                else color = [239, 68, 68];

                doc.setTextColor(color[0], color[1], color[2]);
            }
        },
    });

    // Get final Y position after table
    yPos = (doc as any).lastAutoTable.finalY + 15;

    // Notes section (if exists)
    if (data.notes) {
        doc.setFillColor(254, 249, 195); // Yellow-100
        doc.roundedRect(margin, yPos, pageWidth - margin * 2, 25, 2, 2, "F");

        doc.setFontSize(9);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(133, 77, 14); // Yellow-800
        doc.text("Catatan Guru:", margin + 5, yPos + 8);

        doc.setFont("helvetica", "normal");
        doc.text(data.notes, margin + 5, yPos + 18);

        yPos += 30;
    }

    // Footer
    const footerY = doc.internal.pageSize.getHeight() - 30;

    doc.setDrawColor(200, 200, 200);
    doc.line(margin, footerY, pageWidth - margin, footerY);

    doc.setTextColor(100, 100, 100);
    doc.setFontSize(8);
    doc.text(
        `Dicetak pada: ${new Date().toLocaleDateString("id-ID", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric"
        })}`,
        margin,
        footerY + 10
    );

    doc.text("Exam System © 2024", pageWidth - margin, footerY + 10, { align: "right" });

    // Teacher signature area
    if (data.teacherName) {
        doc.setTextColor(0, 0, 0);
        doc.setFontSize(9);
        doc.text("Guru Pengampu:", pageWidth - margin - 40, footerY - 20, { align: "center" });
        doc.text("_________________", pageWidth - margin - 40, footerY - 8, { align: "center" });
        doc.text(data.teacherName, pageWidth - margin - 40, footerY - 2, { align: "center" });
    }

    // Save PDF
    const fileName = `Rapor_${data.studentName.replace(/\s+/g, "_")}_${data.semester}.pdf`;
    doc.save(fileName);
}

function getGrade(score: number): string {
    if (score >= 90) return "A";
    if (score >= 80) return "B";
    if (score >= 70) return "C";
    if (score >= 60) return "D";
    return "E";
}

// Export function for teacher analytics (multi-student report)
export function generateClassReport(className: string, students: StudentReportData[]): void {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 20;

    // Header
    doc.setFillColor(79, 70, 229);
    doc.rect(0, 0, pageWidth, 35, "F");

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(18);
    doc.setFont("helvetica", "bold");
    doc.text("LAPORAN NILAI KELAS", pageWidth / 2, 15, { align: "center" });

    doc.setFontSize(12);
    doc.text(className, pageWidth / 2, 27, { align: "center" });

    // Summary stats
    const avgScore = students.reduce((sum, s) => sum + s.averageScore, 0) / students.length;
    const passRate = (students.filter(s => s.averageScore >= 70).length / students.length) * 100;

    doc.setTextColor(0, 0, 0);
    let yPos = 50;

    doc.setFontSize(10);
    doc.text(`Total Siswa: ${students.length}`, margin, yPos);
    doc.text(`Rata-rata Kelas: ${avgScore.toFixed(1)}`, margin + 60, yPos);
    doc.text(`Tingkat Kelulusan: ${passRate.toFixed(1)}%`, margin + 130, yPos);

    yPos += 15;

    // Student ranking table
    const tableData = students
        .sort((a, b) => b.averageScore - a.averageScore)
        .map((s, idx) => [
            (idx + 1).toString(),
            s.studentName,
            s.studentId,
            s.totalExams.toString(),
            s.averageScore.toFixed(1),
            getGrade(s.averageScore),
        ]);

    autoTable(doc, {
        startY: yPos,
        head: [["Rank", "Nama Siswa", "NIS", "Jml Ujian", "Rata-rata", "Grade"]],
        body: tableData,
        theme: "striped",
        headStyles: {
            fillColor: [79, 70, 229],
            textColor: [255, 255, 255],
            fontStyle: "bold",
            halign: "center",
        },
        bodyStyles: {
            halign: "center",
            fontSize: 9,
        },
        margin: { left: margin, right: margin },
    });

    const fileName = `Laporan_Kelas_${className.replace(/\s+/g, "_")}.pdf`;
    doc.save(fileName);
}

// Excel Export function  
export function exportToExcel(data: any[], filename: string): void {
    // Convert data to CSV format (simple Excel-compatible)
    const headers = Object.keys(data[0] || {});
    const csvContent = [
        headers.join(","),
        ...data.map(row =>
            headers.map(h => {
                const val = row[h];
                // Escape commas and quotes
                if (typeof val === "string" && (val.includes(",") || val.includes('"'))) {
                    return `"${val.replace(/"/g, '""')}"`;
                }
                return val;
            }).join(",")
        )
    ].join("\n");

    const blob = new Blob(["\ufeff" + csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${filename}.csv`;
    link.click();
    URL.revokeObjectURL(url);
}
