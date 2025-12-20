import jsPDF from "jspdf";

// Emoji/İkon çizim fonksiyonları
const drawIcon = (doc, x, y, type, color) => {
  doc.setFillColor(color[0], color[1], color[2]);
  
  switch(type) {
    case 'check':
      // Onay işareti
      doc.setLineWidth(1);
      doc.setDrawColor(color[0], color[1], color[2]);
      doc.line(x, y, x+2, y+2);
      doc.line(x+2, y+2, x+5, y-2);
      break;
    case 'sport':
      // Spor ikonu (dumbbell)
      doc.circle(x, y, 1.5, 'F');
      doc.rect(x+1, y-0.5, 2, 1, 'F');
      doc.circle(x+4, y, 1.5, 'F');
      break;
    case 'code':
      // Kod ikonu (</>)
      doc.setFontSize(12);
      doc.setFont("courier", "bold");
      doc.setTextColor(color[0], color[1], color[2]);
      doc.text("</>", x, y+2);
      break;
    case 'journal':
      // Günlük ikonu (kitap)
      doc.roundedRect(x, y-2, 4, 5, 0.5, 0.5, 'FD');
      doc.line(x+2, y-2, x+2, y+3);
      break;
    case 'ai':
      // AI ikonu (yıldız)
      doc.setFontSize(10);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(color[0], color[1], color[2]);
      doc.text("✨", x, y+2);
      break;
    case 'star':
      // Yıldız
      doc.setFontSize(8);
      doc.text("⭐", x, y+1);
      break;
  }
};

// Grafik çizim fonksiyonları
const drawBarChart = (doc, x, y, width, height, data, maxValue, color) => {
  const barWidth = width / data.length;
  const padding = 2;
  
  // Eksen
  doc.setDrawColor(100, 100, 100);
  doc.line(x, y + height, x + width, y + height);
  
  data.forEach((value, index) => {
    const barHeight = (value / maxValue) * height;
    const barX = x + (index * barWidth) + padding;
    
    // Bar
    doc.setFillColor(color[0], color[1], color[2]);
    doc.roundedRect(barX, y + height - barHeight, barWidth - (padding * 2), barHeight, 1, 1, 'F');
    
    // Değer
    doc.setFontSize(7);
    doc.setTextColor(80, 80, 80);
    doc.text(String(value), barX + (barWidth - padding * 2) / 2, y + height - barHeight - 1, { align: 'center' });
  });
};

const drawPieChart = (doc, x, y, radius, percentage, color1, color2) => {
  const angle = (percentage / 100) * 360;
  
  // Tamamlanmış kısım
  doc.setFillColor(color1[0], color1[1], color1[2]);
  if (percentage > 0) {
    doc.circle(x, y, radius, 'F');
  }
  
  // Tamamlanmamış kısım
  if (percentage < 100) {
    doc.setFillColor(color2[0], color2[1], color2[2]);
    doc.circle(x, y, radius, 'F');
    
    // Tamamlanan kısmı tekrar çiz
    doc.setFillColor(color1[0], color1[1], color1[2]);
    const startAngle = -90;
    const endAngle = startAngle + angle;
    
    // Basit pie chart (üçgenler ile yaklaşık)
    const segments = Math.ceil(angle / 10);
    for (let i = 0; i < segments; i++) {
      const a1 = ((startAngle + (i * 10)) * Math.PI) / 180;
      const a2 = ((startAngle + ((i + 1) * 10)) * Math.PI) / 180;
      
      doc.setFillColor(color1[0], color1[1], color1[2]);
      doc.triangle(
        x, y,
        x + radius * Math.cos(a1), y + radius * Math.sin(a1),
        x + radius * Math.cos(a2), y + radius * Math.sin(a2),
        'F'
      );
    }
  }
  
  // Yüzde metni
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(255, 255, 255);
  doc.text(`%${percentage}`, x, y + 2, { align: 'center' });
};

const drawTrendLine = (doc, x, y, width, height, data, color) => {
  if (data.length < 2) return;
  
  const maxValue = Math.max(...data, 1);
  const stepX = width / (data.length - 1);
  
  // Izgara çizgileri
  doc.setDrawColor(220, 220, 220);
  doc.setLineWidth(0.3);
  for (let i = 0; i <= 4; i++) {
    const gridY = y + (height / 4) * i;
    doc.line(x, gridY, x + width, gridY);
  }
  
  // Trend çizgisi
  doc.setDrawColor(color[0], color[1], color[2]);
  doc.setLineWidth(1.5);
  
  for (let i = 0; i < data.length - 1; i++) {
    const x1 = x + i * stepX;
    const y1 = y + height - (data[i] / maxValue) * height;
    const x2 = x + (i + 1) * stepX;
    const y2 = y + height - (data[i + 1] / maxValue) * height;
    
    doc.line(x1, y1, x2, y2);
    
    // Noktalar
    doc.setFillColor(color[0], color[1], color[2]);
    doc.circle(x1, y1, 1.5, 'F');
  }
  
  // Son nokta
  const lastX = x + (data.length - 1) * stepX;
  const lastY = y + height - (data[data.length - 1] / maxValue) * height;
  doc.circle(lastX, lastY, 1.5, 'F');
};

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
    const lightOrange = [255, 218, 185];
    const lightCream = [255, 248, 240];
    const darkText = [44, 62, 80];
    const gray = [127, 140, 141];
    const lightGray = [200, 200, 200];
    const green = [39, 174, 96];
    const blue = [52, 152, 219];
    const purple = [155, 89, 182];

    let y = 20;
    const leftMargin = 20;
    const rightMargin = 190;
    const pageWidth = 210;

    // ============ KAPAK SAYFASI ============
    
    // Gradient arka plan (turuncu tonları)
    for (let i = 0; i < 297; i++) {
      const ratio = i / 297;
      const r = Math.floor(orange[0] + (lightCream[0] - orange[0]) * ratio);
      const g = Math.floor(orange[1] + (lightCream[1] - orange[1]) * ratio);
      const b = Math.floor(orange[2] + (lightCream[2] - orange[2]) * ratio);
      doc.setFillColor(r, g, b);
      doc.rect(0, i, pageWidth, 1, 'F');
    }
    
    // Dekoratif daireler
    doc.setFillColor(255, 255, 255, 0.1);
    doc.circle(30, 50, 40, 'F');
    doc.circle(180, 200, 60, 'F');
    doc.circle(100, 250, 30, 'F');
    
    // Ana başlık
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(48);
    doc.setFont("helvetica", "bold");
    doc.text("SOULFIY", pageWidth / 2, 80, { align: "center" });
    
    // Alt başlık
    doc.setFontSize(18);
    doc.setFont("helvetica", "normal");
    doc.text("Haftalık Gelişim Raporu", pageWidth / 2, 95, { align: "center" });
    
    // Tarih
    doc.setFontSize(12);
    doc.text(date, pageWidth / 2, 105, { align: "center" });

    // Tarih
    doc.setFontSize(12);
    doc.text(date, pageWidth / 2, 105, { align: "center" });
    
    // İstatistik hesaplama
    const completedDays = days.filter((d) => d.completed).length;
    const completionPercentage = Math.round((completedDays / 7) * 100);
    const daysWithJournal = days.filter((d) => d.journal && d.journal.trim()).length;
    const aiUsageCount = Object.keys(aiSuggestions || {}).length;
    const totalHours = completedDays * 3;
    
    // Büyük başarı yüzdesi (pie chart)
    drawPieChart(doc, pageWidth / 2, 140, 25, completionPercentage, green, lightGray);
    
    // Alt istatistikler - 3 kutu
    const boxY = 180;
    const boxWidth = 50;
    const boxHeight = 30;
    const spacing = 5;
    const startX = (pageWidth - (boxWidth * 3 + spacing * 2)) / 2;
    
    // Kutu 1: Tamamlanan Günler
    doc.setFillColor(255, 255, 255, 0.9);
    doc.roundedRect(startX, boxY, boxWidth, boxHeight, 3, 3, 'F');
    doc.setTextColor(orange[0], orange[1], orange[2]);
    doc.setFontSize(24);
    doc.setFont("helvetica", "bold");
    doc.text(String(completedDays), startX + boxWidth / 2, boxY + 15, { align: 'center' });
    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.text("Tamamlanan Gün", startX + boxWidth / 2, boxY + 23, { align: 'center' });
    
    // Kutu 2: Toplam Saat
    doc.setFillColor(255, 255, 255, 0.9);
    doc.roundedRect(startX + boxWidth + spacing, boxY, boxWidth, boxHeight, 3, 3, 'F');
    doc.setTextColor(blue[0], blue[1], blue[2]);
    doc.setFontSize(24);
    doc.setFont("helvetica", "bold");
    doc.text(String(totalHours), startX + boxWidth + spacing + boxWidth / 2, boxY + 15, { align: 'center' });
    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.text("Kodlama Saati", startX + boxWidth + spacing + boxWidth / 2, boxY + 23, { align: 'center' });
    
    // Kutu 3: AI Kullanımı
    doc.setFillColor(255, 255, 255, 0.9);
    doc.roundedRect(startX + (boxWidth + spacing) * 2, boxY, boxWidth, boxHeight, 3, 3, 'F');
    doc.setTextColor(purple[0], purple[1], purple[2]);
    doc.setFontSize(24);
    doc.setFont("helvetica", "bold");
    doc.text(String(aiUsageCount), startX + (boxWidth + spacing) * 2 + boxWidth / 2, boxY + 15, { align: 'center' });
    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.text("AI Önerisi", startX + (boxWidth + spacing) * 2 + boxWidth / 2, boxY + 23, { align: 'center' });
    
    // Motivasyon mesajı
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(14);
    doc.setFont("helvetica", "italic");
    let motivationMsg = "Harika gidiyorsun! 🚀";
    if (completionPercentage >= 80) motivationMsg = "Mükemmel bir hafta! 🎉";
    else if (completionPercentage >= 50) motivationMsg = "İyi iş çıkarıyorsun! 💪";
    else if (completionPercentage > 0) motivationMsg = "Devam et, başarırsın! 🌟";
    doc.text(motivationMsg, pageWidth / 2, 240, { align: 'center' });
    
    // Alt bilgi
    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.text("soulfiy.vercel.app", pageWidth / 2, 280, { align: 'center' });
    
    // ============ SAYFA 2: GRAFIKLER VE İSTATISTIKLER ============
    doc.addPage();
    y = 20;
    
    // Sayfa başlığı
    doc.setFillColor(orange[0], orange[1], orange[2]);
    doc.roundedRect(leftMargin, y, 170, 12, 3, 3, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.text("📊 Haftalık Analiz", leftMargin + 5, y + 8);
    y += 20;

    doc.text("📊 Haftalık Analiz", leftMargin + 5, y + 8);
    y += 20;
    
    // Bar Chart: Günlük tamamlanma durumu
    doc.setFillColor(lightCream[0], lightCream[1], lightCream[2]);
    doc.roundedRect(leftMargin, y, 170, 60, 3, 3, 'F');
    
    doc.setTextColor(darkText[0], darkText[1], darkText[2]);
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("Günlük Tamamlanma", leftMargin + 5, y + 8);
    
    const completionData = days.map(d => d.completed ? 100 : 0);
    drawBarChart(doc, leftMargin + 10, y + 15, 150, 35, completionData, 100, green);
    
    // Gün isimleri
    doc.setFontSize(7);
    doc.setTextColor(gray[0], gray[1], gray[2]);
    days.forEach((day, i) => {
      const dayShort = day.day.substring(0, 3);
      const x = leftMargin + 10 + (150 / 7) * i + (150 / 7) / 2;
      doc.text(dayShort, x, y + 55, { align: 'center' });
    });
    
    y += 68;
    
    // İki sütun: Sol = Trend, Sağ = Özet İstatistikler
    
    // SOL: Trend Line (Günlük aktivite)
    const leftColX = leftMargin;
    const rightColX = leftMargin + 88;
    const colWidth = 82;
    
    doc.setFillColor(lightCream[0], lightCream[1], lightCream[2]);
    doc.roundedRect(leftColX, y, colWidth, 70, 3, 3, 'F');
    
    doc.setTextColor(darkText[0], darkText[1], darkText[2]);
    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.text("Aktivite Trendi", leftColX + 5, y + 8);
    
    // Aktivite skoru (günlük yazı uzunluğu bazlı)
    const activityData = days.map(d => {
      let score = 0;
      if (d.completed) score += 30;
      if (d.journal && d.journal.length > 20) score += 40;
      if (d.sport) score += 15;
      if (d.code) score += 15;
      return score;
    });
    
    drawTrendLine(doc, leftColX + 8, y + 15, 65, 45, activityData, blue);
    
    doc.setFontSize(7);
    doc.setTextColor(gray[0], gray[1], gray[2]);
    doc.text("Pzt", leftColX + 8, y + 65);
    doc.text("Paz", leftColX + 68, y + 65, { align: 'right' });
    
    // SAĞ: Özet İstatistikler
    doc.setFillColor(lightCream[0], lightCream[1], lightCream[2]);
    doc.roundedRect(rightColX, y, colWidth, 70, 3, 3, 'F');
    
    doc.setTextColor(darkText[0], darkText[1], darkText[2]);
    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.text("Özet İstatistikler", rightColX + 5, y + 8);
    
    let statsY = y + 18;
    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    
    // İkon ve istatistikler
    const stats = [
      { icon: 'check', label: 'Tamamlanan', value: `${completedDays}/7`, color: green },
      { icon: 'journal', label: 'Günlük Yazılan', value: String(daysWithJournal), color: blue },
      { icon: 'ai', label: 'AI Kullanımı', value: String(aiUsageCount), color: purple },
      { icon: 'sport', label: 'Kodlama Saati', value: `${totalHours}h`, color: orange },
    ];
    
    stats.forEach(stat => {
      drawIcon(doc, rightColX + 8, statsY, stat.icon, stat.color);
      doc.setTextColor(darkText[0], darkText[1], darkText[2]);
      doc.text(stat.label + ':', rightColX + 18, statsY + 2);
      doc.setFont("helvetica", "bold");
      doc.text(stat.value, rightColX + 75, statsY + 2, { align: 'right' });
      doc.setFont("helvetica", "normal");
      statsY += 10;
    });
    
    y += 78;

    y += 78;
    
    // En üretken gün analizi
    let mostProductiveDay = null;
    let maxScore = 0;
    days.forEach((day, i) => {
      let score = 0;
      if (day.completed) score += 40;
      if (day.journal) score += day.journal.length / 10;
      if (day.sport) score += 20;
      if (day.code) score += 20;
      if (score > maxScore) {
        maxScore = score;
        mostProductiveDay = day.day;
      }
    });
    
    // Bilgi kartları
    doc.setFillColor(green[0], green[1], green[2]);
    doc.roundedRect(leftMargin, y, 82, 25, 3, 3, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.text("⭐ En Üretken Gün", leftMargin + 5, y + 8);
    doc.setFontSize(16);
    doc.text(mostProductiveDay || "—", leftMargin + 5, y + 18);
    
    // Streak hesaplama
    let currentStreak = 0;
    let maxStreak = 0;
    let tempStreak = 0;
    days.forEach((day, i) => {
      if (day.completed) {
        tempStreak++;
        if (tempStreak > maxStreak) maxStreak = tempStreak;
        if (i === days.length - 1 || days[i + 1]?.completed) {
          currentStreak = tempStreak;
        }
      } else {
        tempStreak = 0;
      }
    });
    
    doc.setFillColor(orange[0], orange[1], orange[2]);
    doc.roundedRect(rightColX, y, 82, 25, 3, 3, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.text("🔥 En Uzun Streak", rightColX + 5, y + 8);
    doc.setFontSize(16);
    doc.text(`${maxStreak} gün`, rightColX + 5, y + 18);
    
    y += 35;
    
    // ============ GÜNLÜK DETAYLAR ============
    doc.setFillColor(orange[0], orange[1], orange[2]);
    doc.roundedRect(leftMargin, y, 170, 12, 3, 3, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.text("📅 Günlük Detaylar", leftMargin + 5, y + 8);
    y += 20;
    y += 20;
    
    // Her gün için detaylı kart
    days.forEach((day, index) => {
      if (!day) return;

      // Sayfa kontrolü
      if (y > 235) {
        doc.addPage();
        y = 20;
      }

      // Gün kartı arka planı
      const dayColor = day.completed ? green : gray;
      doc.setFillColor(lightCream[0], lightCream[1], lightCream[2]);
      doc.roundedRect(leftMargin, y, 170, 8, 2, 2, 'F');
      
      // Gün başlık çubuğu
      doc.setFillColor(dayColor[0], dayColor[1], dayColor[2]);
      doc.roundedRect(leftMargin, y, 170, 8, 2, 2, 'F');

      // İkon
      if (day.completed) {
        drawIcon(doc, leftMargin + 3, y + 4, 'check', [255, 255, 255]);
      }
      
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(12);
      doc.setFont("helvetica", "bold");
      doc.text(day.day || "Gün " + (index + 1), leftMargin + 12, y + 5.5);

      y += 12;

      // İçerik kutusu
      doc.setFillColor(255, 255, 255);
      doc.roundedRect(leftMargin, y, 170, 'auto', 2, 2, 'F');
      
      let contentY = y + 5;

      // Spor aktivitesi
      if (day.sport) {
        drawIcon(doc, leftMargin + 5, contentY, 'sport', orange);
        doc.setTextColor(darkText[0], darkText[1], darkText[2]);
        doc.setFontSize(9);
        doc.setFont("helvetica", "bold");
        doc.text("Spor:", leftMargin + 14, contentY + 2);
        doc.setFont("helvetica", "normal");
        doc.setTextColor(gray[0], gray[1], gray[2]);
        const sportLines = doc.splitTextToSize(day.sport, 140);
        sportLines.forEach(line => {
          doc.text(line, leftMargin + 30, contentY + 2);
          contentY += 4;
        });
        contentY += 2;
      }

      // Kodlama aktivitesi
      if (day.code) {
        drawIcon(doc, leftMargin + 5, contentY, 'code', blue);
        doc.setTextColor(darkText[0], darkText[1], darkText[2]);
        doc.setFont("helvetica", "bold");
        doc.text("Kod:", leftMargin + 14, contentY + 2);
        doc.setFont("helvetica", "normal");
        doc.setTextColor(gray[0], gray[1], gray[2]);
        const codeLines = doc.splitTextToSize(day.code, 140);
        codeLines.forEach(line => {
          doc.text(line, leftMargin + 30, contentY + 2);
          contentY += 4;
        });
        contentY += 2;
      }

      // Günlük (Journal/Notes)
      if (day.journal && day.journal.trim()) {
        if (contentY > 260) {
          doc.addPage();
          contentY = 20;
        }

        drawIcon(doc, leftMargin + 5, contentY, 'journal', purple);
        doc.setTextColor(darkText[0], darkText[1], darkText[2]);
        doc.setFontSize(9);
        doc.setFont("helvetica", "bold");
        doc.text("Günlük:", leftMargin + 14, contentY + 2);
        contentY += 5;

        doc.setTextColor(darkText[0], darkText[1], darkText[2]);
        doc.setFont("helvetica", "normal");
        doc.setFontSize(8);

        const journalLines = doc.splitTextToSize(day.journal, 150);
        journalLines.forEach((line) => {
          if (contentY > 275) {
            doc.addPage();
            contentY = 20;
          }
          doc.text(line, leftMargin + 10, contentY);
          contentY += 4;
        });

        contentY += 2;
      }

      // AI Önerisi
      if (aiSuggestions && aiSuggestions[day.id]) {
        if (contentY > 250) {
          doc.addPage();
          contentY = 20;
        }

        // AI kutusu
        doc.setFillColor(255, 250, 240);
        const aiBoxHeight = Math.min(30, 280 - contentY);
        doc.roundedRect(leftMargin + 5, contentY - 2, 160, aiBoxHeight, 2, 2, 'F');

        drawIcon(doc, leftMargin + 10, contentY + 2, 'ai', orange);
        doc.setTextColor(darkOrange[0], darkOrange[1], darkOrange[2]);
        doc.setFontSize(9);
        doc.setFont("helvetica", "bold");
        doc.text("AI Önerisi", leftMargin + 20, contentY + 3);
        contentY += 7;

        doc.setTextColor(darkText[0], darkText[1], darkText[2]);
        doc.setFontSize(8);
        doc.setFont("helvetica", "italic");

        const aiLines = doc.splitTextToSize(aiSuggestions[day.id], 145);
        aiLines.forEach((line) => {
          if (contentY > 275) {
            doc.addPage();
            contentY = 20;
          }
          doc.text(line, leftMargin + 12, contentY);
          contentY += 3.5;
        });

        contentY += 3;
      }

      // Motivasyon alıntısı
      if (day.quote && contentY < 270) {
        doc.setTextColor(orange[0], orange[1], orange[2]);
        doc.setFontSize(7);
        doc.setFont("helvetica", "italic");
        const quoteLines = doc.splitTextToSize('"' + day.quote + '"', 150);
        quoteLines.forEach((line) => {
          if (contentY > 275) {
            doc.addPage();
            contentY = 20;
          }
          doc.text(line, leftMargin + 10, contentY);
          contentY += 3.5;
        });
      }

      y = contentY + 6;
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
