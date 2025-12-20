import jsPDF from "jspdf";

export function exportToPDF(days, aiSuggestions) {
  try {
    const now = new Date();
    const date = now.toLocaleDateString("tr-TR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    const doc = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });

    // Modern sıcak renkler
    const orange = [242, 153, 74];
    const darkOrange = [230, 126, 34];
    const lightCream = [255, 248, 240];
    const darkText = [44, 62, 80];
    const gray = [127, 140, 141];
    const green = [39, 174, 96];

    let y = 20;
    const leftMargin = 20;
    const rightMargin = 190;
    const pageWidth = 210;

    // Başlık bölümü - Turuncu gradient arkaplan
    doc.setFillColor(orange[0], orange[1], orange[2]);
    doc.rect(0, 0, pageWidth, 45, "F");

    // Beyaz başlık
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(32);
    doc.setFont("helvetica", "bold");
    doc.text("SOULFIY", pageWidth / 2, 22, { align: "center" });

    doc.setFontSize(14);
    doc.setFont("helvetica", "normal");
    doc.text("Haftalik Gelisim Raporu", pageWidth / 2, 32, {
      align: "center",
    });

    doc.setFontSize(10);
    doc.text(date, pageWidth / 2, 39, { align: "center" });

    y = 55;

    // Haftalık özet hesaplama
    const completedDays = days.filter((d) => d.completed).length;
    const totalProgress = days.reduce(
      (sum, day) => sum + (day.progress || 0),
      0
    );
    const avgProgress = (totalProgress / 7).toFixed(0);
    const daysWithJournal = days.filter(
      (d) => d.journal && d.journal.trim()
    ).length;
    const daysWithTasks = days.filter(
      (d) => d.tasks && d.tasks.length > 0
    ).length;

    // Özet kartı - Krem renkli kutu
    doc.setFillColor(lightCream[0], lightCream[1], lightCream[2]);
    doc.roundedRect(leftMargin, y, 170, 40, 3, 3, "F");

    // Özet başlık
    doc.setTextColor(darkOrange[0], darkOrange[1], darkOrange[2]);
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.text("HAFTALIK OZET", leftMargin + 5, y + 10);

    // Özet istatistikleri - 2 sütun
    doc.setTextColor(darkText[0], darkText[1], darkText[2]);
    doc.setFontSize(11);
    doc.setFont("helvetica", "normal");

    const col1X = leftMargin + 5;
    const col2X = leftMargin + 90;
    let statsY = y + 20;

    doc.setFont("helvetica", "bold");
    doc.text("Tamamlanan Gun:", col1X, statsY);
    doc.setFont("helvetica", "normal");
    doc.text(completedDays + " / 7", col1X + 50, statsY);

    doc.setFont("helvetica", "bold");
    doc.text("Gunluk Tutulan:", col2X, statsY);
    doc.setFont("helvetica", "normal");
    doc.text(String(daysWithJournal), col2X + 50, statsY);

    statsY += 8;

    doc.setFont("helvetica", "bold");
    doc.text("Ort. Ilerleme:", col1X, statsY);
    doc.setFont("helvetica", "normal");
    doc.text("%" + avgProgress, col1X + 50, statsY);

    doc.setFont("helvetica", "bold");
    doc.text("Gorev Eklenen:", col2X, statsY);
    doc.setFont("helvetica", "normal");
    doc.text(String(daysWithTasks), col2X + 50, statsY);

    y += 50;

    // Her gün için detaylar
    days.forEach((day, index) => {
      if (!day) return;

      // Sayfa kontrolü
      if (y > 240) {
        doc.addPage();
        y = 20;
      }

      // Gün başlık çubuğu
      const dayColor = day.completed ? green : orange;
      doc.setFillColor(dayColor[0], dayColor[1], dayColor[2]);
      doc.roundedRect(leftMargin, y, 170, 12, 2, 2, "F");

      doc.setTextColor(255, 255, 255);
      doc.setFontSize(13);
      doc.setFont("helvetica", "bold");
      doc.text(day.day || "Gun " + (index + 1), leftMargin + 5, y + 8);

      // İlerleme bilgisi sağda
      const progressText = "%" + (day.progress || 0);
      doc.setFontSize(11);
      doc.text(progressText, rightMargin - 5, y + 8, { align: "right" });

      y += 17;

      // Spor aktivitesi
      if (day.sport) {
        doc.setTextColor(darkText[0], darkText[1], darkText[2]);
        doc.setFontSize(10);
        doc.setFont("helvetica", "bold");
        doc.text("Spor:", leftMargin + 5, y);
        doc.setFont("helvetica", "normal");
        doc.setTextColor(gray[0], gray[1], gray[2]);
        doc.text(day.sport, leftMargin + 20, y);
        y += 6;
      }

      // Kodlama aktivitesi
      if (day.code) {
        doc.setTextColor(darkText[0], darkText[1], darkText[2]);
        doc.setFont("helvetica", "bold");
        doc.text("Kod:", leftMargin + 5, y);
        doc.setFont("helvetica", "normal");
        doc.setTextColor(gray[0], gray[1], gray[2]);
        doc.text(day.code, leftMargin + 20, y);
        y += 6;
      }

      // Günlük (Journal/Notes)
      if (day.journal && day.journal.trim()) {
        if (y > 260) {
          doc.addPage();
          y = 20;
        }

        doc.setTextColor(darkText[0], darkText[1], darkText[2]);
        doc.setFontSize(10);
        doc.setFont("helvetica", "bold");
        doc.text("Gunluk:", leftMargin + 5, y);
        y += 5;

        doc.setTextColor(gray[0], gray[1], gray[2]);
        doc.setFont("helvetica", "normal");
        doc.setFontSize(9);

        const journalLines = doc.splitTextToSize(day.journal, 155);
        journalLines.forEach((line) => {
          if (y > 275) {
            doc.addPage();
            y = 20;
          }
          doc.text(line, leftMargin + 10, y);
          y += 4;
        });

        y += 2;
      }

      // Ekstra görevler (tasks array - varsa)
      if (day.tasks && day.tasks.length > 0) {
        if (y > 265) {
          doc.addPage();
          y = 20;
        }

        doc.setTextColor(darkText[0], darkText[1], darkText[2]);
        doc.setFontSize(10);
        doc.setFont("helvetica", "bold");
        doc.text("Gorevler:", leftMargin + 5, y);
        y += 5;

        doc.setFontSize(9);
        doc.setFont("helvetica", "normal");

        day.tasks.forEach((task) => {
          if (y > 275) {
            doc.addPage();
            y = 20;
          }

          const checkbox = task.completed ? "[X]" : "[ ]";
          const taskColor = task.completed ? green : gray;
          doc.setTextColor(taskColor[0], taskColor[1], taskColor[2]);

          const taskLines = doc.splitTextToSize(
            checkbox + " " + task.text,
            150
          );
          taskLines.forEach((line) => {
            doc.text(line, leftMargin + 10, y);
            y += 4;
          });
        });

        y += 2;
      }

      // AI Önerisi
      if (aiSuggestions && aiSuggestions[day.day]) {
        if (y > 245) {
          doc.addPage();
          y = 20;
        }

        // AI kutusu
        doc.setFillColor(255, 245, 235);
        doc.roundedRect(leftMargin + 5, y - 2, 160, 8, 2, 2, "F");

        doc.setTextColor(darkOrange[0], darkOrange[1], darkOrange[2]);
        doc.setFontSize(9);
        doc.setFont("helvetica", "bold");
        doc.text("AI Onerisi", leftMargin + 10, y + 4);
        y += 10;

        doc.setTextColor(darkText[0], darkText[1], darkText[2]);
        doc.setFontSize(8);
        doc.setFont("helvetica", "italic");

        const aiLines = doc.splitTextToSize(aiSuggestions[day.day], 150);
        aiLines.forEach((line) => {
          if (y > 275) {
            doc.addPage();
            y = 20;
          }
          doc.text(line, leftMargin + 10, y);
          y += 4;
        });

        y += 3;
      }

      // Motivasyon alıntısı
      if (day.quote && y < 270) {
        doc.setTextColor(orange[0], orange[1], orange[2]);
        doc.setFontSize(8);
        doc.setFont("helvetica", "italic");
        const quoteLines = doc.splitTextToSize('"' + day.quote + '"', 155);
        quoteLines.forEach((line) => {
          if (y > 275) {
            doc.addPage();
            y = 20;
          }
          doc.text(line, leftMargin + 10, y);
          y += 4;
        });
      }

      y += 8;
    });

    // Footer - tüm sayfalara
    const pageCount = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setTextColor(gray[0], gray[1], gray[2]);
      doc.setFontSize(8);
      doc.setFont("helvetica", "normal");
      doc.text("Soulfiy - soulfiy.vercel.app", pageWidth / 2, 287, {
        align: "center",
      });
      doc.text("Sayfa " + i + " / " + pageCount, rightMargin - 5, 287, {
        align: "right",
      });
    }

    // PDF'i indir
    const filename =
      "soulfiy-rapor-" + now.toISOString().split("T")[0] + ".pdf";
    doc.save(filename);
  } catch (error) {
    console.error("PDF olusturma hatasi:", error);
    throw error;
  }
}
