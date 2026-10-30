import { jsPDF } from 'jspdf';
import { ProjectData } from '../data/schema';
import { validateSiteBoundary } from './polygonArea';

export function generateProjectSummaryPDF(data: ProjectData) {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 18;
  const contentWidth = pageWidth - margin * 2;
  let y = margin;

  function checkPageBreak(requiredSpace: number) {
    if (y + requiredSpace > pageHeight - margin) {
      doc.addPage();
      y = margin + 10;
      addHeaderFooter();
    }
  }

  function addHeaderFooter() {
    doc.setFontSize(8);
    doc.setTextColor(120, 140, 160);
    doc.text('Smart City Site Planning | Urban Development Project Report', margin, 10);
    const pageCount = (doc.internal as any).getNumberOfPages ? (doc.internal as any).getNumberOfPages() : 1;
    doc.text(`Page ${pageCount}`, pageWidth - margin - 15, pageHeight - 8);
    doc.text('Original work made in Autodesk Forma — No AI-generated content', margin, pageHeight - 8);
  }

  // Cover / Header Banner
  doc.setFillColor(16, 42, 67); // Deep navy #102A43
  doc.rect(margin, y, contentWidth, 38, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.setTextColor(255, 255, 255);
  doc.text(data.project.name, margin + 6, y + 10, { maxWidth: contentWidth - 12 });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(232, 163, 74); // Amber #E8A34A
  doc.text(`Initiative: Sustainable Urban Development | Autodesk Forma + Revit`, margin + 6, y + 22);
  doc.setTextColor(200, 220, 240);
  doc.text(`Theme: ${data.project.theme} | Category: ${data.project.category}`, margin + 6, y + 28);
  doc.text(`Date of Export: ${new Date().toLocaleDateString('en-GB')}`, margin + 6, y + 34);

  y += 46;

  // Non-negotiable authenticity badge
  doc.setFillColor(245, 248, 250);
  doc.setDrawColor(15, 118, 110);
  doc.rect(margin, y, contentWidth, 12, 'FD');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(15, 118, 110);
  doc.text('VERIFICATION DECLARATION: Original work made in Autodesk Forma - no AI-generated content.', margin + 4, y + 7);
  y += 18;

  // 1. Objectives
  checkPageBreak(35);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.setTextColor(16, 42, 67);
  doc.text('1. Project Objectives & Problem Statement', margin, y);
  y += 6;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(50, 60, 70);
  const abstractLines = doc.splitTextToSize(data.project.abstract, contentWidth);
  doc.text(abstractLines, margin, y);
  y += abstractLines.length * 4.5 + 4;

  data.project.objectives.slice(0, 4).forEach((obj) => {
    checkPageBreak(8);
    const lines = doc.splitTextToSize(`• ${obj}`, contentWidth - 6);
    doc.text(lines, margin + 4, y);
    y += lines.length * 4 + 2;
  });
  y += 6;

  // 2. Site Overview & Area Validation
  checkPageBreak(40);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.setTextColor(16, 42, 67);
  doc.text('2. Site Overview & Boundary Verification', margin, y);
  y += 6;

  const boundaryCoords = data.site.boundaryGeoJSON?.coordinates?.[0] || [];
  const areaVal = validateSiteBoundary(boundaryCoords);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.text(`Site Name: ${data.site.name || '--'}`, margin, y);
  doc.text(`Location: ${data.site.location || '--'}`, margin, y + 5);
  doc.text(`Center Coordinates: ${data.site.centerCoordinates.lat}° N, ${data.site.centerCoordinates.lng}° E`, margin, y + 10);
  doc.text(`Calculated Polygon Area: ${areaVal.calculatedAreaKm2} km² [${areaVal.status}]`, margin, y + 15);
  doc.text(`Perimeter: ${areaVal.perimeterKm} km | Zoning: ${data.site.zoning}`, margin, y + 20);
  y += 28;

  // 3. Proposals Comparison Table
  checkPageBreak(45);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.setTextColor(16, 42, 67);
  doc.text('3. Autodesk Forma Proposal Comparison', margin, y);
  y += 6;

  // Table header
  doc.setFillColor(220, 235, 245);
  doc.rect(margin, y, contentWidth, 7, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(16, 42, 67);
  doc.text('Metric / Parameter', margin + 3, y + 5);
  doc.text('Proposal A', margin + 70, y + 5);
  doc.text('Proposal B', margin + 115, y + 5);
  doc.text('Unit / Source', margin + 145, y + 5);
  y += 8;

  const tableRows = [
    { label: 'Gross Floor Area (GFA)', pA: `${data.proposals[0]?.grossFloorAreaM2?.toLocaleString() ?? '--'}`, pB: `${data.proposals[1]?.grossFloorAreaM2?.toLocaleString() ?? '--'}`, unit: 'm²' },
    { label: 'Green Space Ratio', pA: `${data.proposals[0]?.greenSpacePercent ?? '--'}%`, pB: `${data.proposals[1]?.greenSpacePercent ?? '--'}%`, unit: '%' },
    { label: 'Building Count', pA: `${data.proposals[0]?.buildingsCount ?? '--'}`, pB: `${data.proposals[1]?.buildingsCount ?? '--'}`, unit: 'blocks' },
    { label: 'Embodied Carbon', pA: `${data.proposals[0]?.metrics?.embodiedCarbon ?? '--'}`, pB: `${data.proposals[1]?.metrics?.embodiedCarbon ?? '--'}`, unit: 'kg CO₂e/m²' },
    { label: 'Daylight Potential', pA: `${data.proposals[0]?.metrics?.daylightPotential ?? '--'}%`, pB: `${data.proposals[1]?.metrics?.daylightPotential ?? '--'}%`, unit: '%' },
    { label: 'Solar Energy Yield', pA: `${data.proposals[0]?.metrics?.solarYield ?? '--'}`, pB: `${data.proposals[1]?.metrics?.solarYield ?? '--'}`, unit: 'kWh/m²/yr' },
    { label: 'Wind Comfort Score', pA: `${data.proposals[0]?.metrics?.windComfortScore ?? '--'}/100`, pB: `${data.proposals[1]?.metrics?.windComfortScore ?? '--'}/100`, unit: 'Score' },
  ];

  tableRows.forEach((row, idx) => {
    checkPageBreak(6);
    if (idx % 2 === 0) {
      doc.setFillColor(248, 250, 252);
      doc.rect(margin, y - 1, contentWidth, 5.5, 'F');
    }
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(30, 40, 50);
    doc.text(row.label, margin + 3, y + 3);
    doc.text(row.pA, margin + 70, y + 3);
    doc.text(row.pB, margin + 115, y + 3);
    doc.text(row.unit, margin + 145, y + 3);
    y += 5.5;
  });
  y += 6;

  // 4. Forma Analyses Key Insights
  checkPageBreak(50);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.setTextColor(16, 42, 67);
  doc.text('4. Autodesk Forma 8-Module Analysis Summary', margin, y);
  y += 6;

  Object.values(data.analyses).forEach((an) => {
    checkPageBreak(14);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(15, 118, 110);
    doc.text(`• ${an.title} [${an.dataSource}]`, margin + 2, y);
    y += 4.5;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(60, 70, 80);
    const insightLines = doc.splitTextToSize(an.keyInsight, contentWidth - 8);
    doc.text(insightLines, margin + 6, y);
    y += insightLines.length * 3.8 + 3;
  });
  y += 4;

  // 5. Final Decision & Justification
  checkPageBreak(30);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.setTextColor(16, 42, 67);
  doc.text('5. Final Proposal Decision & Revit BIM Pipeline', margin, y);
  y += 6;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(16, 42, 67);
  doc.text(`Selected Scheme: ${data.comparison.teamDecision}`, margin, y, { maxWidth: contentWidth });
  y += 7;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(50, 60, 70);
  const justLines = doc.splitTextToSize(`Justification: ${data.comparison.teamJustification}`, contentWidth);
  doc.text(justLines, margin, y);
  y += justLines.length * 4 + 4;

  doc.text(`Revit Sync Status: ${data.revit.revitSyncConfirmed ? 'Confirmed' : 'Pending'} | Drawing Block: ${data.revit.deliverableStatus.drawingBlock}`, margin, y);
  y += 10;

  // 6. Team & Endorsement
  checkPageBreak(25);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.setTextColor(16, 42, 67);
  doc.text('6. Team & Faculty Endorsement', margin, y);
  y += 6;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.text(`Faculty Advisor: ${data.mentor.facultySpoc} (${data.mentor.facultyDepartment})`, margin, y);
  doc.text(`Academic Review Status: ${data.mentor.spocVerified ? 'Verified' : 'In Progress'}`, margin, y + 5);
  y += 12;

  const teamList = data.team.map((m) => `${m.name} (${m.role})`).join(' | ');
  const teamLines = doc.splitTextToSize(`Project Team: ${teamList}`, contentWidth);
  doc.text(teamLines, margin, y);

  addHeaderFooter();

  // Save PDF
  doc.save(`Smart-City-Site-Planning-Report-${new Date().toISOString().slice(0, 10)}.pdf`);
}
