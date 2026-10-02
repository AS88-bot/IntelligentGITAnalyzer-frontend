const API_BASE_URL =
import.meta.env.VITE_API_BASE_URL || "${API_BASE_URL}";

import { useEffect, useState } from "react";

import {

  BarChart,

  Bar,

  XAxis,

  YAxis,

  CartesianGrid,

  Tooltip,

  ResponsiveContainer,

  LineChart,

  Line,

} from "recharts";

import "./App.css";

interface RepositoryInfo {

  repositoryPath?: string;

  repositoryName?: string;

  currentBranch?: string;

  commitCount?: number;

  latestCommitId?: string;

  latestCommitMessage?: string;

  latestCommitAuthor?: string;

  latestCommitAuthorEmail?: string;

  latestCommitDate?: string;

}

interface GitSummary {

  commits?: number;

  filesAdded?: number;

  filesModified?: number;

  filesDeleted?: number;

  filesRenamed?: number;

  linesAdded?: number;

  linesRemoved?: number;

}

interface CommitTimeline {

  commitId?: string;

  shortCommitId?: string;

  author?: string;

  date?: string;

  message?: string;

  filesChanged?: number;

  linesAdded?: number;

  linesRemoved?: number;

  linesChanged?: number;

}

interface ContributorActivity {

  author?: string;

  commits?: number;

  linesAdded?: number;

  linesRemoved?: number;

  linesChanged?: number;

}

interface SourceSummary {

  sourceFiles?: number;

  typescriptFiles?: number;

  javascriptFiles?: number;

  lines?: number;

  blankLines?: number;

  commentLines?: number;

  codeLines?: number;

  functions?: number;

  imports?: number;

  exports?: number;

  reactComponents?: number;

  todoCount?: number;

  fixmeCount?: number;

  totalComplexity?: number;

  failedFiles?: number;

  averageLinesPerFile?: number;

  averageFunctionsPerFile?: number;

  averageComplexityPerFile?: number;

}

interface FileGitMetrics {

  changeCount?: number;

  linesAdded?: number;

  linesRemoved?: number;

  churn?: number;

  contributors?: string[];

  latestCommit?: Record<string, unknown>;

}

interface FileIntelligence {

  file?: string;

  path?: string;

  lines?: number;

  functions?: number;

  complexity?: number;

  complexityCategory?: string;

  reactComponents?: number;

  /*

   * Some backend responses expose Git metrics directly.

   */

  gitChangeCount?: number;

  gitLinesAdded?: number;

  gitLinesRemoved?: number;

  gitChurn?: number;

  /*

   * Hotspot / maintenance responses can expose

   * these values directly.

   */

  changeCount?: number;

  linesAdded?: number;

  linesRemoved?: number;

  churn?: number;

  /*

   * File intelligence can also contain a nested Git object.

   */

  git?: FileGitMetrics;

  hotspotScore?: number;

  hotspotCategory?: string;

  hotspotReasons?: string[];

  maintenanceScore?: number;

  maintenanceCategory?: string;

  maintenanceReasons?: string[];

}

interface RepositoryHealth {

  sourceFiles?: number;

  totalLines?: number;

  totalFunctions?: number;

  totalImports?: number;

  totalExports?: number;

  totalReactComponents?: number;

  totalComplexity?: number;

  commits?: number;

  filesWithHighComplexity?: number;

  largeFiles?: number;

  frequentlyChangedFiles?: number;

  highChurnFiles?: number;

  highHotspotFiles?: number;

  maintenanceCandidates?: number;

  status?: string;

  statusDescription?: string;

}

interface GitAnalytics {

  commitTimeline?: CommitTimeline[];

  contributorActivity?: ContributorActivity[];

}

interface FileAnalysisDetails {

  success?: boolean;

  repositoryPath?: string;

  file?: string;

  source?: {
    path?: string;
    file?: string;
    extension?: string;
    lines?: number;
    blankLines?: number;
    commentLines?: number;
    codeLines?: number;
    functions?: number;
    imports?: number;
    exports?: number;
    reactComponents?: number;
    todoCount?: number;
    fixmeCount?: number;
    complexity?: number;
    complexityCategory?: string;
    sourceSizeBytes?: number;
  };

  git?: FileGitMetrics;

  hotspotScore?: number;

  hotspotCategory?: string;

  hotspotReasons?: string[];

  maintenanceScore?: number;

  maintenanceCategory?: string;

  maintenanceReasons?: string[];

  recommendations?: string[];

}

interface SourceFileDetails {
  success?: boolean;
  repositoryPath?: string;
  file?: string;
  extension?: string;
  content?: string;
  lines?: number;
  sizeBytes?: number;
}

interface RepositoryInsights {
  sourceFileCount?: number;
  totalSourceLines?: number;
  totalFunctions?: number;
  totalComplexity?: number;
  commitCount?: number;
  totalLinesChanged?: number;
  topHotspot?: Record<string, unknown> | null;
  topMaintenanceCandidate?: Record<string, unknown> | null;
  largestSourceFile?: Record<string, unknown> | null;
  mostFrequentlyChangedFile?: Record<string, unknown> | null;
  largestCommit?: Record<string, unknown> | null;
  topContributor?: Record<string, unknown> | null;
}

interface RepositoryAnalysis {

  repositoryInfo?: RepositoryInfo;

  gitSummary?: GitSummary;

  gitAnalytics?: GitAnalytics;

  commitTimeline?: CommitTimeline[];

  contributorActivity?: ContributorActivity[];

  sourceSummary?: SourceSummary;

  fileIntelligence?: FileIntelligence[];

  hotspots?: FileIntelligence[];

  maintenanceCandidates?: FileIntelligence[];

  repositoryHealth?: RepositoryHealth;

  repositoryInsights?: RepositoryInsights;

  recommendations?: string[];

}

interface CodeSearchResult {
  file?: string;
  line?: number;
  content?: string;
  extension?: string;
}

interface CodeSearchResponse {
  success?: boolean;
  repositoryPath?: string;
  query?: string;
  totalMatches?: number;
  filesMatched?: number;
  results?: CodeSearchResult[];
  message?: string;
}

interface AssistantResponse {
  success?: boolean;
  repositoryPath?: string;
  question?: string;
  answer?: string;
  supportingData?: Record<string, unknown>;
  message?: string;
}

interface ProductivityAnalyticsResponse {
  success?: boolean;
  repositoryPath?: string;
  repositoryInfo?: RepositoryInfo;
  metrics?: {
    commitCount?: number;
    filesAdded?: number;
    filesModified?: number;
    filesDeleted?: number;
    filesRenamed?: number;
    linesAdded?: number;
    linesRemoved?: number;
    sourceFiles?: number;
    sourceLines?: number;
    functions?: number;
    complexity?: number;
    contributors?: number;
    hotspots?: number;
    maintenanceCandidates?: number;
  };
  commitTimeline?: CommitTimeline[];
  contributorActivity?: ContributorActivity[];
  hotspots?: FileIntelligence[];
  maintenanceCandidates?: FileIntelligence[];
  repositoryHealth?: RepositoryHealth;
  repositoryInsights?: RepositoryInsights;
  message?: string;
}

function App() {

  const [repositoryMode, setRepositoryMode] = useState<"local" | "github">("local");

  const [repositoryPath, setRepositoryPath] = useState(

    "C:\\IGA_Work\\ibelieveyou"

  );

  const [repositoryUrl, setRepositoryUrl] = useState(
    "https://github.com/AS88-bot/ibelieveyou.git"
  );

  const [data, setData] = useState<RepositoryAnalysis | null>(null);

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  const [selectedFile, setSelectedFile] = useState("");

  const [fileDetails, setFileDetails] =
    useState<FileAnalysisDetails | null>(null);

  const [fileLoading, setFileLoading] = useState(false);

  const [fileError, setFileError] = useState("");

  const [explorerFile, setExplorerFile] = useState("");
  const [explorerDetails, setExplorerDetails] =
    useState<SourceFileDetails | null>(null);
  const [explorerLoading, setExplorerLoading] = useState(false);
  const [explorerError, setExplorerError] = useState("");

  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] =
    useState<CodeSearchResponse | null>(null);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchError, setSearchError] = useState("");

  const [assistantQuestion, setAssistantQuestion] = useState("");
  const [assistantResponse, setAssistantResponse] =
    useState<AssistantResponse | null>(null);
  const [assistantLoading, setAssistantLoading] = useState(false);
  const [assistantError, setAssistantError] = useState("");
  const [productivityData, setProductivityData] =
    useState<ProductivityAnalyticsResponse | null>(null);
  const [productivityLoading, setProductivityLoading] = useState(false);
  const [productivityError, setProductivityError] = useState("");


  const analyzeFile = async (filePath: string) => {

    if (!filePath) return;

    setSelectedFile(filePath);
    setFileLoading(true);
    setFileError("");
    setFileDetails(null);

    try {
      const encodedRepositoryPath = encodeURIComponent(repositoryPath);
      const encodedFilePath = encodeURIComponent(filePath);
      const response = await fetch(
        `${API_BASE_URL}/api/repository/file?repositoryPath=${encodedRepositoryPath}&file=${encodedFilePath}`
      );

      if (!response.ok) {
        let message = `Backend returned ${response.status}`;
        try {
          const errorBody = await response.json();
          if (errorBody?.message) message = errorBody.message;
        } catch {
          // Keep the HTTP status message.
        }
        throw new Error(message);
      }

      const result = await response.json();
      if (result?.success === false) {
        throw new Error(result?.message ?? "File analysis failed.");
      }
      setFileDetails(result);
    } catch (err) {
      console.error(err);
      setFileError(
        err instanceof Error
          ? err.message
          : "Could not analyze the selected file."
      );
    } finally {
      setFileLoading(false);
    }
  };

  const loadSourceFile = async (filePath: string) => {
    if (!filePath) return;

    setExplorerFile(filePath);
    setExplorerLoading(true);
    setExplorerError("");
    setExplorerDetails(null);

    try {
      const encodedRepositoryPath = encodeURIComponent(repositoryPath);
      const encodedFilePath = encodeURIComponent(filePath);
      const response = await fetch(
        `${API_BASE_URL}/api/repository/source?repositoryPath=${encodedRepositoryPath}&file=${encodedFilePath}`
      );

      if (!response.ok) {
        let message = `Backend returned ${response.status}`;
        try {
          const errorBody = await response.json();
          if (errorBody?.message) message = errorBody.message;
        } catch {
          // Keep the HTTP status message.
        }
        throw new Error(message);
      }

      const result: SourceFileDetails & { message?: string } =
        await response.json();

      if (result?.success === false) {
        throw new Error(result.message ?? "Could not load source file.");
      }

      setExplorerDetails(result);
    } catch (err) {
      console.error(err);
      setExplorerError(
        err instanceof Error
          ? err.message
          : "Could not load the selected source file."
      );
    } finally {
      setExplorerLoading(false);
    }
  };

  const searchRepository = async () => {
    const query = searchQuery.trim();

    if (!query) {
      setSearchError("Please enter a search query.");
      setSearchResults(null);
      return;
    }

    setSearchLoading(true);
    setSearchError("");
    setSearchResults(null);

    try {
      const encodedRepositoryPath = encodeURIComponent(repositoryPath);
      const encodedQuery = encodeURIComponent(query);

      const response = await fetch(
        `${API_BASE_URL}/api/repository/search?repositoryPath=${encodedRepositoryPath}&query=${encodedQuery}`
      );

      if (!response.ok) {
        let message = `Backend returned ${response.status}`;

        try {
          const errorBody = await response.json();
          if (errorBody?.message) message = errorBody.message;
        } catch {
          // Keep the HTTP status message.
        }

        throw new Error(message);
      }

      const result: CodeSearchResponse = await response.json();

      if (result?.success === false) {
        throw new Error(result.message ?? "Code search failed.");
      }

      setSearchResults(result);
    } catch (err) {
      console.error(err);
      setSearchError(
        err instanceof Error
          ? err.message
          : "Could not search the repository."
      );
    } finally {
      setSearchLoading(false);
    }
  };

  const askAssistant = async (questionOverride?: string) => {
    const question = (questionOverride ?? assistantQuestion).trim();

    if (!question) {
      setAssistantError("Please enter a question.");
      setAssistantResponse(null);
      return;
    }

    setAssistantQuestion(question);
    setAssistantLoading(true);
    setAssistantError("");
    setAssistantResponse(null);

    try {
      const params = new URLSearchParams({
        repositoryPath,
        question,
      });

      const response = await fetch(
        `${API_BASE_URL}/api/repository/assistant?${params.toString()}`
      );

      if (!response.ok) {
        let message = `Backend returned ${response.status}`;
        try {
          const errorBody = await response.json();
          if (errorBody?.message) message = errorBody.message;
        } catch {
          // Keep the HTTP status message.
        }
        throw new Error(message);
      }

      const result: AssistantResponse = await response.json();

      if (result?.success === false) {
        throw new Error(
          result.message ?? "Developer assistant could not answer the question."
        );
      }

      setAssistantResponse(result);
    } catch (err) {
      console.error(err);
      setAssistantError(
        err instanceof Error
          ? err.message
          : "Could not connect to the developer assistant."
      );
    } finally {
      setAssistantLoading(false);
    }
  };

  const highlightSearchText = (content: string, query: string) => {
    const trimmedQuery = query.trim();

    if (!trimmedQuery) {
      return content;
    }

    const escapedQuery = trimmedQuery.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const parts = content.split(new RegExp(`(${escapedQuery})`, "gi"));

    return parts.map((part, index) =>
      part.toLowerCase() === trimmedQuery.toLowerCase() ? (
        <mark
          key={`${part}-${index}`}
          style={{
            padding: "1px 3px",
            borderRadius: "4px",
            background: "#ffe08a",
            color: "#111",
            fontWeight: 700,
          }}
        >
          {part}
        </mark>
      ) : (
        <span key={`${part}-${index}`}>{part}</span>
      )
    );
  };

  const getSearchFileExtension = (file?: string) => {
    if (!file) {
      return "FILE";
    }

    const lastPart = file.split("/").pop() ?? file;
    const dotIndex = lastPart.lastIndexOf(".");

    return dotIndex > 0
      ? lastPart.slice(dotIndex + 1).toUpperCase()
      : "FILE";
  };

  const formatBytes = (bytes?: number) => {
    if (bytes === undefined || bytes === null || Number.isNaN(bytes)) {
      return "0 B";
    }
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  const explorerFiles = (data?.fileIntelligence ?? [])
    .map((item) => item.path ?? item.file ?? "")
    .filter((filePath, index, files) =>
      filePath && files.indexOf(filePath) === index
    );

  const sourceLines = (explorerDetails?.content ?? "").split(/\r?\n/);

  const loadProductivityAnalytics = async (pathOverride?: string) => {
    const path = (pathOverride ?? repositoryPath).trim();

    if (!path) {
      setProductivityError("Repository path is required.");
      setProductivityData(null);
      return;
    }

    setProductivityLoading(true);
    setProductivityError("");

    try {
      const encodedPath = encodeURIComponent(path);
      const response = await fetch(
        `${API_BASE_URL}/api/repository/productivity?repositoryPath=${encodedPath}`
      );

      if (!response.ok) {
        let message = `Backend returned ${response.status}`;
        try {
          const errorBody = await response.json();
          if (errorBody?.message) message = errorBody.message;
        } catch {
          // Keep the HTTP status message.
        }
        throw new Error(message);
      }

      const result: ProductivityAnalyticsResponse = await response.json();

      if (result?.success === false) {
        throw new Error(result.message ?? "Productivity analytics failed.");
      }

      setProductivityData(result);
    } catch (err) {
      console.error(err);
      setProductivityError(
        err instanceof Error
          ? err.message
          : "Could not load productivity analytics."
      );
    } finally {
      setProductivityLoading(false);
    }
  };

  const escapeReportHtml = (value: unknown) => {
    return String(value ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  };

  const generateRepositoryReport = (printReport = false) => {
    if (!data && !productivityData) {
      setError("Analyze the repository before generating a report.");
      return;
    }

    const repo = productivityData?.repositoryInfo ?? data?.repositoryInfo;
    const metrics = productivityData?.metrics;
    const health = productivityData?.repositoryHealth ?? data?.repositoryHealth;
    const insights = productivityData?.repositoryInsights ?? data?.repositoryInsights;
    const source = data?.sourceSummary;
    const git = data?.gitSummary;
    const timeline = productivityData?.commitTimeline ?? data?.commitTimeline ?? [];
    const contributors = productivityData?.contributorActivity ?? data?.contributorActivity ?? [];
    const hotspots = productivityData?.hotspots ?? data?.hotspots ?? [];
    const maintenance = productivityData?.maintenanceCandidates ?? data?.maintenanceCandidates ?? [];
    const recommendations = data?.recommendations ?? [];
    const generatedAt = new Date().toLocaleString();

    const metricRows = [
      ["Commits", metrics?.commitCount ?? git?.commits ?? 0],
      ["Lines added", metrics?.linesAdded ?? git?.linesAdded ?? 0],
      ["Lines removed", metrics?.linesRemoved ?? git?.linesRemoved ?? 0],
      ["Source files", metrics?.sourceFiles ?? source?.sourceFiles ?? 0],
      ["Source lines", metrics?.sourceLines ?? source?.lines ?? 0],
      ["Functions", metrics?.functions ?? source?.functions ?? 0],
      ["Total complexity", metrics?.complexity ?? source?.totalComplexity ?? 0],
      ["Contributors", metrics?.contributors ?? contributors.length],
      ["Hotspots", metrics?.hotspots ?? hotspots.length],
      ["Maintenance candidates", metrics?.maintenanceCandidates ?? maintenance.length],
    ];

    const metricHtml = metricRows.map(([label, value]) =>
      `<div class="metric"><div class="metric-label">${escapeReportHtml(label)}</div><div class="metric-value">${escapeReportHtml(value)}</div></div>`
    ).join("");

    const contributorHtml = contributors.length
      ? contributors.map((item) => `<tr><td>${escapeReportHtml(item.author ?? "Unknown")}</td><td>${item.commits ?? 0}</td><td>${item.linesAdded ?? 0}</td><td>${item.linesRemoved ?? 0}</td></tr>`).join("")
      : `<tr><td colspan="4">No contributor activity was returned.</td></tr>`;

    const hotspotHtml = hotspots.length
      ? hotspots.slice(0, 10).map((item, index) => `<tr><td>${index + 1}</td><td>${escapeReportHtml(item.file ?? item.path ?? "Unknown file")}</td><td>${item.hotspotScore ?? 0}</td><td>${item.complexity ?? 0}</td><td>${getGitChangeCount(item)}</td><td>${getGitChurn(item)}</td></tr>`).join("")
      : `<tr><td colspan="6">No hotspots were returned.</td></tr>`;

    const maintenanceHtml = maintenance.length
      ? maintenance.slice(0, 10).map((item, index) => `<tr><td>${index + 1}</td><td>${escapeReportHtml(item.file ?? item.path ?? "Unknown file")}</td><td>${item.maintenanceScore ?? 0}</td><td>${item.complexity ?? 0}</td><td>${getGitChangeCount(item)}</td><td>${getGitChurn(item)}</td></tr>`).join("")
      : `<tr><td colspan="6">No maintenance candidates were returned.</td></tr>`;

    const timelineHtml = timeline.length
      ? timeline.slice().reverse().slice(0, 15).map((item) => `<tr><td>${escapeReportHtml(item.shortCommitId ?? item.commitId?.slice(0, 7) ?? "Unknown")}</td><td>${escapeReportHtml(item.author ?? "Unknown")}</td><td>${escapeReportHtml(item.date ?? "")}</td><td>${item.filesChanged ?? 0}</td><td>${item.linesAdded ?? 0}</td><td>${item.linesRemoved ?? 0}</td><td>${escapeReportHtml(item.message ?? "")}</td></tr>`).join("")
      : `<tr><td colspan="7">No commit timeline was returned.</td></tr>`;

    const recommendationHtml = recommendations.length
      ? `<ol>${recommendations.map((item) => `<li>${escapeReportHtml(item)}</li>`).join("")}</ol>`
      : `<p>No repository-level recommendations were generated.</p>`;

    const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>Git Intelligence Repository Report - ${escapeReportHtml(repo?.repositoryName ?? "Repository")}</title>
<style>
  *{box-sizing:border-box} body{font-family:Arial,Helvetica,sans-serif;margin:0;color:#1f2937;background:#f4f6f8;line-height:1.5}
  .page{max-width:1100px;margin:0 auto;background:#fff;min-height:100vh;padding:40px}
  h1{margin:0 0 8px;font-size:30px} h2{margin:30px 0 12px;font-size:20px;border-bottom:2px solid #e5e7eb;padding-bottom:8px}
  h3{margin:20px 0 10px}.muted{color:#6b7280}.header{border-bottom:3px solid #111827;padding-bottom:22px}.path{word-break:break-all;font-family:monospace;font-size:13px}
  .metrics{display:grid;grid-template-columns:repeat(auto-fit,minmax(160px,1fr));gap:12px;margin-top:20px}.metric{border:1px solid #e5e7eb;border-radius:10px;padding:14px;background:#fafafa}.metric-label{font-size:12px;color:#6b7280}.metric-value{font-size:23px;font-weight:700;margin-top:4px}
  .grid{display:grid;grid-template-columns:1fr 1fr;gap:20px}.card{border:1px solid #e5e7eb;border-radius:10px;padding:16px}.status{font-weight:700}.table-wrap{overflow-x:auto}table{width:100%;border-collapse:collapse;font-size:13px}th,td{border:1px solid #e5e7eb;padding:8px;text-align:left;vertical-align:top}th{background:#f3f4f6}ol{padding-left:24px}.footer{margin-top:40px;padding-top:15px;border-top:1px solid #e5e7eb;font-size:12px;color:#6b7280}
  @media(max-width:700px){.page{padding:20px}.grid{grid-template-columns:1fr}}
  @media print{body{background:#fff}.page{max-width:none;padding:15px}.no-print{display:none!important}h2{break-after:avoid}.card,table{break-inside:avoid}}
</style>
</head>
<body><main class="page">
<header class="header">
  <h1>Git Intelligence Repository Report</h1>
  <div><strong>${escapeReportHtml(repo?.repositoryName ?? "Repository")}</strong></div>
  <div class="path">${escapeReportHtml(repo?.repositoryPath ?? repositoryPath)}</div>
  <p class="muted">Branch: ${escapeReportHtml(repo?.currentBranch ?? "Unknown")} · Generated: ${escapeReportHtml(generatedAt)}</p>
</header>

<h2>Executive Summary</h2>
<div class="metrics">${metricHtml}</div>

<div class="grid">
<section class="card"><h3>Repository Health</h3>
<p className="status">${escapeReportHtml(health?.status ?? "Analysis completed")}</p>

<p>${escapeReportHtml(health?.statusDescription ?? "Repository health details are based on the available Git and source-code analysis.")}</p>
<section class="card"><h3>Key Files</h3>
<p><strong>Top hotspot:</strong> ${escapeReportHtml(insights?.topHotspot?.file ?? insights?.topHotspot?.path ?? hotspots[0]?.file ?? "None identified")}</p>
<p><strong>Maintenance candidate:</strong> ${escapeReportHtml(insights?.topMaintenanceCandidate?.file ?? insights?.topMaintenanceCandidate?.path ?? maintenance[0]?.file ?? "None identified")}</p>
<p><strong>Largest source file:</strong> ${escapeReportHtml(insights?.largestSourceFile?.file ?? insights?.largestSourceFile?.path ?? "None identified")}</p>
</section>
</div>

<h2>Commit Activity</h2>
<div class="table-wrap"><table><thead><tr><th>Commit</th><th>Author</th><th>Date</th><th>Files</th><th>Added</th><th>Removed</th><th>Message</th></tr></thead><tbody>${timelineHtml}</tbody></table></div>

<h2>Contributor Activity</h2>
<div class="table-wrap"><table><thead><tr><th>Contributor</th><th>Commits</th><th>Lines Added</th><th>Lines Removed</th></tr></thead><tbody>${contributorHtml}</tbody></table></div>

<h2>Top Hotspots</h2>
<div class="table-wrap"><table><thead><tr><th>#</th><th>File</th><th>Score</th><th>Complexity</th><th>Changes</th><th>Churn</th></tr></thead><tbody>${hotspotHtml}</tbody></table></div>

<h2>Maintenance Candidates</h2>
<div class="table-wrap"><table><thead><tr><th>#</th><th>File</th><th>Score</th><th>Complexity</th><th>Changes</th><th>Churn</th></tr></thead><tbody>${maintenanceHtml}</tbody></table></div>

<h2>Recommendations</h2>${recommendationHtml}

<h2>Source-Code Summary</h2>
<div class="grid"><div class="card"><p>TypeScript files: ${source?.typescriptFiles ?? 0}</p><p>JavaScript files: ${source?.javascriptFiles ?? 0}</p><p>Code lines: ${source?.codeLines ?? 0}</p><p>Imports: ${source?.imports ?? 0}</p></div><div class="card"><p>Exports: ${source?.exports ?? 0}</p><p>React components: ${source?.reactComponents ?? 0}</p><p>TODO count: ${source?.todoCount ?? 0}</p><p>FIXME count: ${source?.fixmeCount ?? 0}</p></div></div>

<footer class="footer">Generated by Git Intelligence Assistant. This report reflects the repository analysis available at generation time.</footer>
</main></body></html>`;

    const blob = new Blob([html], { type: "text/html;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `${repo?.repositoryName ?? "repository"}-git-intelligence-report.html`;
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    URL.revokeObjectURL(url);

    if (printReport) {
      const printWindow = window.open("", "_blank", "noopener,noreferrer");
      if (printWindow) {
        printWindow.document.write(html);
        printWindow.document.close();
        printWindow.focus();
        setTimeout(() => printWindow.print(), 300);
      }
    }
  };

  const analyzeRepository = async () => {

    const inputValue = (repositoryMode === "github"
      ? repositoryUrl
      : repositoryPath).trim();

    if (!inputValue) {
      setError(
        repositoryMode === "github"
          ? "Please enter a GitHub repository URL."
          : "Please enter a local repository path."
      );
      return;
    }

    setLoading(true);
    setError("");
    setData(null);
    setProductivityData(null);

    try {

      let endpoint: string;

      if (repositoryMode === "github") {
        const encodedUrl = encodeURIComponent(inputValue);
        endpoint =
          `${API_BASE_URL}/api/repository/analyze-remote?repositoryUrl=${encodedUrl}`;
      } else {
        const encodedPath = encodeURIComponent(inputValue);
        endpoint =
          `${API_BASE_URL}/api/repository/analyze?path=${encodedPath}`;
      }

      const response = await fetch(endpoint);

      if (!response.ok) {
        let message = `Backend returned ${response.status}`;
        try {
          const errorBody = await response.json();
          if (errorBody?.message) message = errorBody.message;
        } catch {
          // Keep the HTTP status message.
        }
        throw new Error(message);
      }

      const result: RepositoryAnalysis & {
        success?: boolean;
        message?: string;
        repositoryUrl?: string;
        remoteRepository?: boolean;
      } = await response.json();

      if (result?.success === false) {
        throw new Error(result.message ?? "Repository analysis failed.");
      }

      if (!result.repositoryInfo?.repositoryPath && repositoryMode === "local") {
        setRepositoryPath(inputValue);
      }

      if (repositoryMode === "github") {
        const clonedPath = result.repositoryInfo?.repositoryPath;
        if (!clonedPath) {
          throw new Error(
            "The remote repository was analyzed, but the backend did not return its temporary analysis path."
          );
        }
        setRepositoryPath(clonedPath);
        setRepositoryUrl(inputValue);
      } else {
        setRepositoryPath(inputValue);
      }

      setData(result);

      const analysisPath =
        result.repositoryInfo?.repositoryPath ?? inputValue;

      await loadProductivityAnalytics(analysisPath);

    } catch (err) {

      console.error(err);

      setError(
        err instanceof Error
          ? err.message
          : "Could not analyze the repository."
      );

    } finally {

      setLoading(false);

    }

  };

  useEffect(() => {

    if (repositoryMode === "local") {
      analyzeRepository();
    }

    // The GitHub mode waits for the user to click Analyze Repository.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [repositoryMode]);

  /*

   * ---------------------------------------------------------

   * Helper methods

   * ---------------------------------------------------------

   */

  const getCategoryClass = (category?: string) => {

    return String(category ?? "")

      .toLowerCase()

      .replace(/\s+/g, "-");

  };

  /*

   * Git metrics can come from different parts of the

   * backend response depending on the analysis object.

   *

   * We check every supported location.

   */

  const getGitChangeCount = (item: FileIntelligence) => {

    return (

      item.changeCount ??

      item.gitChangeCount ??

      item.git?.changeCount ??

      0

    );

  };

  const getGitChurn = (item: FileIntelligence) => {

    return (

      item.churn ??

      item.gitChurn ??

      item.git?.churn ??

      0

    );

  };

  /*

   * ---------------------------------------------------------

   * Chart data

   * ---------------------------------------------------------

   */

  const gitActivityData = [

    {

      name: "Added",

      value: data?.gitSummary?.filesAdded ?? 0,

    },

    {

      name: "Modified",

      value: data?.gitSummary?.filesModified ?? 0,

    },

    {

      name: "Deleted",

      value: data?.gitSummary?.filesDeleted ?? 0,

    },

  ];

  const complexityData = (data?.fileIntelligence ?? []).map(

    (item) => ({

      name: item.file ?? "Unknown",

      complexity: item.complexity ?? 0,

    })

  );

  const hotspotData = (data?.fileIntelligence ?? []).map(

    (item) => ({

      name: item.file ?? "Unknown",

      score: item.hotspotScore ?? 0,

    })

  );

  const commitTimeline =
    data?.gitAnalytics?.commitTimeline ??
    data?.commitTimeline ??
    [];

  const contributorActivity =
    data?.gitAnalytics?.contributorActivity ??
    data?.contributorActivity ??
    [];

  const commitTimelineData = commitTimeline
    .slice()
    .reverse()
    .map((commit) => ({

      name: commit.shortCommitId ?? "Unknown",

      linesAdded: commit.linesAdded ?? 0,

      linesRemoved: commit.linesRemoved ?? 0,

    }));

  const contributorActivityData = contributorActivity.map((activity) => ({

    author: activity.author ?? "Unknown",

    commits: activity.commits ?? 0,

    linesAdded: activity.linesAdded ?? 0,

    linesRemoved: activity.linesRemoved ?? 0,

    linesChanged: activity.linesChanged ?? 0,

  }));

  return (

    <div className="app">

      <header className="header">

        <div>

          <h1>Git Intelligence Assistant</h1>

          <p>

            Intelligent Git Repository Analysis and Developer

            Productivity

          </p>

        </div>

      </header>

      <main className="container">

        {/* ================================================= */}

        {/* REPOSITORY INPUT                                  */}

        {/* ================================================= */}

        <section className="repository-panel">

          <label>Repository Source</label>

          <div style={{ display: "flex", gap: "10px", marginBottom: "12px", flexWrap: "wrap" }}>
            <button
              type="button"
              onClick={() => {
                setRepositoryMode("local");
                setError("");
              }}
              style={{
                fontWeight: repositoryMode === "local" ? 700 : 400,
                opacity: repositoryMode === "local" ? 1 : 0.75,
              }}
            >
              🖥️ Local Repository
            </button>
            <button
              type="button"
              onClick={() => {
                setRepositoryMode("github");
                setError("");
              }}
              style={{
                fontWeight: repositoryMode === "github" ? 700 : 400,
                opacity: repositoryMode === "github" ? 1 : 0.75,
              }}
            >
              🌐 GitHub Repository
            </button>
          </div>

          <label>
            {repositoryMode === "github"
              ? "GitHub Repository URL"
              : "Repository Path"}
          </label>

          <div className="repository-input-row">

            <input

              type="text"

              value={repositoryMode === "github" ? repositoryUrl : repositoryPath}

              onChange={(event) =>
                repositoryMode === "github"
                  ? setRepositoryUrl(event.target.value)
                  : setRepositoryPath(event.target.value)
              }

              placeholder={
                repositoryMode === "github"
                  ? "https://github.com/username/repository.git"
                  : "C:\\IGA_Work\\ibelieveyou"
              }

            />

            <button

              onClick={analyzeRepository}

              disabled={loading}

            >

              {loading

                ? "Analyzing..."

                : "Analyze Repository"}

            </button>

          </div>

          {repositoryMode === "github" && (
            <p style={{ marginTop: "8px", color: "#666", fontSize: "14px" }}>
              Public GitHub repositories are cloned temporarily by the backend and analyzed using the same Git and source-code analyzers as local repositories.
            </p>
          )}

          {error && (

            <div className="error-message">

              {error}

            </div>

          )}

        </section>

        {/* ================================================= */}
        {/* CODE SEARCH                                      */}
        {/* ================================================= */}
        <section className="section">
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              gap: "16px",
              flexWrap: "wrap",
              marginBottom: "16px",
            }}
          >
            <div>
              <h2 style={{ marginBottom: "6px" }}>🔎 Code Search</h2>
              <p style={{ margin: 0, color: "#666" }}>
                Search across the repository source code and open matching
                files directly in File Intelligence.
              </p>
            </div>
          </div>

          <div
            style={{
              display: "flex",
              gap: "10px",
              flexWrap: "wrap",
              alignItems: "stretch",
            }}
          >
            <input
              type="text"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  searchRepository();
                }
              }}
              placeholder="Search code, function names, imports, TODOs..."
              style={{
                flex: "1 1 420px",
                minWidth: "240px",
                padding: "12px 14px",
                border: "1px solid #ccc",
                borderRadius: "8px",
                fontSize: "14px",
                boxSizing: "border-box",
              }}
            />

            <button
              type="button"
              onClick={searchRepository}
              disabled={searchLoading}
            >
              {searchLoading ? "Searching..." : "Search Code"}
            </button>
          </div>

          {searchError && (
            <div className="error-message" style={{ marginTop: "14px" }}>
              {searchError}
            </div>
          )}

          {searchResults && (
            <div style={{ marginTop: "20px" }}>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
                  gap: "10px",
                  marginBottom: "14px",
                }}
              >
                <div
                  style={{
                    padding: "14px 16px",
                    border: "1px solid #e2e8f0",
                    borderRadius: "12px",
                    background: "#f8fafc",
                  }}
                >
                  <div style={{ fontSize: "12px", color: "#64748b", marginBottom: "4px" }}>
                    Matches
                  </div>
                  <strong style={{ fontSize: "22px" }}>
                    {searchResults.totalMatches ?? 0}
                  </strong>
                </div>

                <div
                  style={{
                    padding: "14px 16px",
                    border: "1px solid #e2e8f0",
                    borderRadius: "12px",
                    background: "#f8fafc",
                  }}
                >
                  <div style={{ fontSize: "12px", color: "#64748b", marginBottom: "4px" }}>
                    Files matched
                  </div>
                  <strong style={{ fontSize: "22px" }}>
                    {searchResults.filesMatched ?? 0}
                  </strong>
                </div>

                <div
                  style={{
                    padding: "14px 16px",
                    border: "1px solid #e2e8f0",
                    borderRadius: "12px",
                    background: "#f8fafc",
                    minWidth: 0,
                  }}
                >
                  <div style={{ fontSize: "12px", color: "#64748b", marginBottom: "4px" }}>
                    Search query
                  </div>
                  <strong
                    style={{
                      display: "block",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                    title={searchResults.query ?? searchQuery}
                  >
                    {searchResults.query ?? searchQuery}
                  </strong>
                </div>
              </div>

              {(searchResults.results ?? []).length === 0 ? (
                <div
                  className="empty-message"
                  style={{
                    padding: "28px",
                    textAlign: "center",
                    border: "1px dashed #cbd5e1",
                    borderRadius: "12px",
                    background: "#f8fafc",
                  }}
                >
                  <div style={{ fontSize: "28px", marginBottom: "8px" }}>🔍</div>
                  <strong>No matching code was found.</strong>
                  <p style={{ margin: "6px 0 0", color: "#64748b" }}>
                    Try a function name, import, component, variable, TODO, or another code fragment.
                  </p>
                </div>
              ) : (
                <div
                  style={{
                    display: "grid",
                    gap: "10px",
                    maxHeight: "620px",
                    overflowY: "auto",
                    padding: "2px",
                  }}
                >
                  {(searchResults.results ?? []).map((result, index) => (
                    <button
                      key={`${result.file}-${result.line}-${index}`}
                      type="button"
                      onClick={() => {
                        if (result.file) {
                          analyzeFile(result.file);
                        }
                      }}
                      style={{
                        width: "100%",
                        textAlign: "left",
                        padding: "14px",
                        border: "1px solid #e2e8f0",
                        borderRadius: "12px",
                        background: "#fff",
                        cursor: result.file ? "pointer" : "default",
                        boxShadow: "0 1px 3px rgba(15, 23, 42, 0.06)",
                        transition: "border-color 0.15s ease, box-shadow 0.15s ease",
                      }}
                      title={result.file ? "Open this file in File Intelligence" : undefined}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          gap: "12px",
                          flexWrap: "wrap",
                          marginBottom: "10px",
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "8px",
                            minWidth: 0,
                          }}
                        >
                          <span
                            style={{
                              flex: "0 0 auto",
                              padding: "3px 7px",
                              borderRadius: "5px",
                              background: "#eef2ff",
                              color: "#3730a3",
                              fontSize: "10px",
                              fontWeight: 800,
                              letterSpacing: "0.5px",
                            }}
                          >
                            {result.extension?.toUpperCase() ??
                              getSearchFileExtension(result.file)}
                          </span>

                          <strong
                            style={{
                              overflowWrap: "anywhere",
                              color: "#1e293b",
                            }}
                          >
                            {result.file ?? "Unknown file"}
                          </strong>
                        </div>

                        <span
                          style={{
                            flex: "0 0 auto",
                            padding: "4px 8px",
                            borderRadius: "6px",
                            background: "#f1f5f9",
                            color: "#475569",
                            fontSize: "12px",
                            fontWeight: 600,
                            whiteSpace: "nowrap",
                          }}
                        >
                          Line {result.line ?? "-"}
                        </span>
                      </div>

                      <pre
                        style={{
                          margin: 0,
                          padding: "11px 12px",
                          overflowX: "auto",
                          borderRadius: "8px",
                          background: "#0f172a",
                          color: "#e2e8f0",
                          border: "1px solid #1e293b",
                          fontFamily:
                            "Consolas, Monaco, 'Courier New', monospace",
                          fontSize: "13px",
                          lineHeight: 1.55,
                          whiteSpace: "pre-wrap",
                          overflowWrap: "anywhere",
                        }}
                      >
                        {highlightSearchText(
                          result.content ?? "",
                          searchResults.query ?? searchQuery
                        )}
                      </pre>

                      <div
                        style={{
                          marginTop: "8px",
                          color: "#64748b",
                          fontSize: "11px",
                        }}
                      >
                        Click to open File Intelligence →
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </section>

        {/* ================================================= */}
        {/* DEVELOPER ASSISTANT                               */}
        {/* ================================================= */}
        <section className="section">
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              gap: "16px",
              flexWrap: "wrap",
              marginBottom: "16px",
            }}
          >
            <div>
              <h2 style={{ marginBottom: "6px" }}>🧠 Developer Assistant</h2>
              <p style={{ margin: 0, color: "#666" }}>
                Ask questions about repository health, hotspots, maintenance,
                complexity, Git activity, and contributors.
              </p>
            </div>
          </div>

          <div
            style={{
              padding: "20px",
              border: "1px solid #e2e8f0",
              borderRadius: "16px",
              background: "#ffffff",
              boxShadow: "0 4px 16px rgba(15, 23, 42, 0.05)",
            }}
          >
            <div
              style={{
                display: "flex",
                gap: "10px",
                alignItems: "stretch",
                flexWrap: "wrap",
              }}
            >
              <input
                type="text"
                value={assistantQuestion}
                onChange={(event) => setAssistantQuestion(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter") askAssistant();
                }}
                placeholder="Ask about your repository..."
                style={{
                  flex: "1 1 420px",
                  minWidth: "240px",
                  padding: "13px 16px",
                  border: "1px solid #cbd5e1",
                  borderRadius: "10px",
                  fontSize: "14px",
                  boxSizing: "border-box",
                }}
              />

              <button
                type="button"
                onClick={() => askAssistant()}
                disabled={assistantLoading}
              >
                {assistantLoading ? "Analyzing..." : "Ask Assistant"}
              </button>
            </div>

            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "8px",
                marginTop: "14px",
              }}
            >
              {[
                "Which files are hotspots?",
                "What are the maintenance candidates?",
                "What is the repository complexity?",
                "Who are the contributors?",
                "Give me a repository overview",
              ].map((question) => (
                <button
                  key={question}
                  type="button"
                  onClick={() => askAssistant(question)}
                  style={{
                    padding: "8px 12px",
                    border: "1px solid #dbe3ef",
                    borderRadius: "999px",
                    background: "#f8fafc",
                    color: "#334155",
                    cursor: "pointer",
                    fontSize: "13px",
                  }}
                >
                  {question}
                </button>
              ))}
            </div>

            {assistantError && (
              <div className="error-message" style={{ marginTop: "14px" }}>
                {assistantError}
              </div>
            )}

            {assistantLoading && (
              <div
                style={{
                  marginTop: "16px",
                  padding: "14px",
                  borderRadius: "10px",
                  background: "#f1f5f9",
                  color: "#475569",
                }}
              >
                Analyzing the repository...
              </div>
            )}

            {assistantResponse?.answer && !assistantLoading && (
              <div
                style={{
                  marginTop: "20px",
                  padding: "18px",
                  borderRadius: "12px",
                  background: "#f8fafc",
                  border: "1px solid #e2e8f0",
                }}
              >
                <div
                  style={{
                    marginBottom: "8px",
                    fontSize: "12px",
                    fontWeight: 700,
                    textTransform: "uppercase",
                    letterSpacing: "0.08em",
                    color: "#6366f1",
                  }}
                >
                  Assistant
                </div>
                <div style={{ color: "#1e293b", lineHeight: 1.6, fontSize: "15px" }}>
                  {assistantResponse.answer}
                </div>
                {assistantResponse.supportingData &&
                  Object.keys(assistantResponse.supportingData).length > 0 && (
                    <details style={{ marginTop: "16px" }}>
                      <summary style={{ cursor: "pointer", fontWeight: 600, color: "#475569" }}>
                        View supporting analysis data
                      </summary>
                      <pre
                        style={{
                          marginTop: "12px",
                          padding: "16px",
                          maxHeight: "320px",
                          overflow: "auto",
                          borderRadius: "10px",
                          background: "#0f172a",
                          color: "#e2e8f0",
                          fontSize: "12px",
                          whiteSpace: "pre-wrap",
                        }}
                      >
                        {JSON.stringify(assistantResponse.supportingData, null, 2)}
                      </pre>
                    </details>
                  )}
              </div>
            )}
          </div>
        </section>

        {data && (

          <>

            {/* ================================================= */}

            {/* REPOSITORY BANNER                                 */}

            {/* ================================================= */}

            <section className="repository-banner">

              <div>

                <h2>

                  {data.repositoryInfo?.repositoryName ??

                    "Repository"}

                </h2>

                <p>

                  {data.repositoryInfo?.repositoryPath ??

                    repositoryPath}

                </p>

              </div>

              <div className="branch-badge">

                {data.repositoryInfo?.currentBranch ??

                  "unknown"}

              </div>

            </section>

            {/* ================================================= */}
            {/* ================================================= */}
            {/* DEVELOPER PRODUCTIVITY ANALYTICS                    */}
            {/* ================================================= */}

            <section className="section">
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  gap: "16px",
                  flexWrap: "wrap",
                  marginBottom: "16px",
                }}
              >
                <div>
                  <h2>📊 Developer Productivity Analytics</h2>
                  <p style={{ margin: 0, color: "#666" }}>
                    Git activity, source-code metrics, contributor activity,
                    and repository productivity signals.
                  </p>
                </div>
                <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                  <button
                    type="button"
                    onClick={() => loadProductivityAnalytics()}
                    disabled={productivityLoading}
                  >
                    {productivityLoading ? "Refreshing..." : "Refresh Analytics"}
                  </button>
                  <button
                    type="button"
                    onClick={() => generateRepositoryReport(false)}
                    disabled={!data && !productivityData}
                  >
                    📄 Download Report
                  </button>
                  <button
                    type="button"
                    onClick={() => generateRepositoryReport(true)}
                    disabled={!data && !productivityData}
                  >
                    🖨️ Print / Save PDF
                  </button>
                </div>
              </div>

              {productivityError && (
                <div className="error-message" style={{ marginBottom: "16px" }}>
                  {productivityError}
                </div>
              )}

              {productivityLoading && !productivityData && (
                <p className="empty-message">Loading productivity analytics...</p>
              )}

              {productivityData && (
                <>
                  <div className="card-grid">
                    {[
                      ["Commits", productivityData.metrics?.commitCount ?? 0],
                      ["Lines Added", productivityData.metrics?.linesAdded ?? 0],
                      ["Lines Removed", productivityData.metrics?.linesRemoved ?? 0],
                      ["Contributors", productivityData.metrics?.contributors ?? 0],
                      ["Hotspots", productivityData.metrics?.hotspots ?? 0],
                      ["Maintenance Candidates", productivityData.metrics?.maintenanceCandidates ?? 0],
                    ].map(([label, value]) => (
                      <div className="metric-card" key={String(label)}>
                        <span>{label}</span>
                        <strong>{value}</strong>
                      </div>
                    ))}
                  </div>

                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
                      gap: "20px",
                      marginTop: "20px",
                    }}
                  >
                    <div className="card" style={{ minHeight: "340px" }}>
                      <h3>Commit Change Activity</h3>
                      <p style={{ color: "#666", fontSize: "13px" }}>
                        Lines added and removed by commit.
                      </p>
                      <div style={{ width: "100%", height: "270px" }}>
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart
                            data={(productivityData.commitTimeline ?? [])
                              .slice()
                              .reverse()
                              .map((commit) => ({
                                name:
                                  commit.shortCommitId ??
                                  commit.commitId?.slice(0, 7) ??
                                  "Commit",
                                linesAdded: commit.linesAdded ?? 0,
                                linesRemoved: commit.linesRemoved ?? 0,
                              }))}
                          >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Line type="monotone" dataKey="linesAdded" name="Lines added" strokeWidth={2} dot={false} />
                            <Line type="monotone" dataKey="linesRemoved" name="Lines removed" strokeWidth={2} dot={false} />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>
                    </div>

                    <div className="card" style={{ minHeight: "340px" }}>
                      <h3>File Change Activity</h3>
                      <p style={{ color: "#666", fontSize: "13px" }}>
                        Added, modified, deleted, and renamed files.
                      </p>
                      <div style={{ width: "100%", height: "270px" }}>
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart
                            data={[{
                              name: "Files",
                              added: productivityData.metrics?.filesAdded ?? 0,
                              modified: productivityData.metrics?.filesModified ?? 0,
                              deleted: productivityData.metrics?.filesDeleted ?? 0,
                              renamed: productivityData.metrics?.filesRenamed ?? 0,
                            }]}
                          >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Bar dataKey="added" name="Added" />
                            <Bar dataKey="modified" name="Modified" />
                            <Bar dataKey="deleted" name="Deleted" />
                            <Bar dataKey="renamed" name="Renamed" />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  </div>

                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
                      gap: "20px",
                      marginTop: "20px",
                    }}
                  >
                    <div className="card">
                      <h3>Contributor Activity</h3>
                      {(productivityData.contributorActivity ?? []).length > 0 ? (
                        <div className="table-wrapper">
                          <table>
                            <thead>
                              <tr>
                                <th>Contributor</th>
                                <th>Commits</th>
                                <th>Lines Added</th>
                                <th>Lines Removed</th>
                              </tr>
                            </thead>
                            <tbody>
                              {(productivityData.contributorActivity ?? []).map((contributor, index) => (
                                <tr key={`${contributor.author ?? "unknown"}-${index}`}>
                                  <td><strong>{contributor.author ?? "Unknown"}</strong></td>
                                  <td>{contributor.commits ?? 0}</td>
                                  <td>{contributor.linesAdded ?? 0}</td>
                                  <td>{contributor.linesRemoved ?? 0}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      ) : (
                        <p className="empty-message">No contributor activity was returned.</p>
                      )}
                    </div>

                    <div className="card">
                      <h3>Productivity Signals</h3>
                      <ul style={{ margin: 0, paddingLeft: "20px" }}>
                        <li>Source files: {productivityData.metrics?.sourceFiles ?? 0}</li>
                        <li>Source lines: {productivityData.metrics?.sourceLines ?? 0}</li>
                        <li>Functions: {productivityData.metrics?.functions ?? 0}</li>
                        <li>Total complexity: {productivityData.metrics?.complexity ?? 0}</li>
                        <li>Hotspots: {productivityData.metrics?.hotspots ?? 0}</li>
                        <li>Maintenance candidates: {productivityData.metrics?.maintenanceCandidates ?? 0}</li>
                      </ul>
                    </div>
                  </div>

                  <div
                    style={{
                      marginTop: "20px",
                      display: "grid",
                      gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
                      gap: "20px",
                    }}
                  >
                    <div className="card">
                      <h3>Top Hotspots</h3>
                      {(productivityData.hotspots ?? []).length > 0 ? (
                        <ol style={{ margin: 0, paddingLeft: "22px" }}>
                          {(productivityData.hotspots ?? []).slice(0, 5).map((item, index) => (
                            <li key={`${item.path ?? item.file ?? "hotspot"}-${index}`} style={{ marginBottom: "10px" }}>
                              <strong>{item.file ?? item.path ?? "Unknown file"}</strong>
                              <div style={{ color: "#666", fontSize: "13px" }}>
                                Score: {item.hotspotScore ?? 0} · Complexity: {item.complexity ?? 0} · Changes: {getGitChangeCount(item)}
                              </div>
                            </li>
                          ))}
                        </ol>
                      ) : (
                        <p className="empty-message">No hotspots were returned.</p>
                      )}
                    </div>

                    <div className="card">
                      <h3>Maintenance Candidates</h3>
                      {(productivityData.maintenanceCandidates ?? []).length > 0 ? (
                        <ol style={{ margin: 0, paddingLeft: "22px" }}>
                          {(productivityData.maintenanceCandidates ?? []).slice(0, 5).map((item, index) => (
                            <li key={`${item.path ?? item.file ?? "maintenance"}-${index}`} style={{ marginBottom: "10px" }}>
                              <strong>{item.file ?? item.path ?? "Unknown file"}</strong>
                              <div style={{ color: "#666", fontSize: "13px" }}>
                                Score: {item.maintenanceScore ?? 0} · Churn: {getGitChurn(item)}
                              </div>
                            </li>
                          ))}
                        </ol>
                      ) : (
                        <p className="empty-message">No maintenance candidates were returned.</p>
                      )}
                    </div>
                  </div>
                </>
              )}
            </section>

            {/* REPOSITORY OVERVIEW                               */}

            {/* ================================================= */}

            <section className="section">

              <h2>Repository Overview</h2>

              <div className="card-grid">

                <div className="metric-card">

                  <span>Commits</span>

                  <strong>

                    {data.gitSummary?.commits ?? 0}

                  </strong>

                </div>

                <div className="metric-card">

                  <span>Source Files</span>

                  <strong>

                    {data.sourceSummary?.sourceFiles ?? 0}

                  </strong>

                </div>

                <div className="metric-card">

                  <span>Total Lines</span>

                  <strong>

                    {data.sourceSummary?.lines ?? 0}

                  </strong>

                </div>

                <div className="metric-card">

                  <span>Functions</span>

                  <strong>

                    {data.sourceSummary?.functions ?? 0}

                  </strong>

                </div>

                <div className="metric-card">

                  <span>Complexity</span>

                  <strong>

                    {data.sourceSummary

                      ?.totalComplexity ?? 0}

                  </strong>

                </div>

                <div className="metric-card">

                  <span>React Components</span>

                  <strong>

                    {data.sourceSummary

                      ?.reactComponents ?? 0}

                  </strong>

                </div>

              </div>

            </section>

            {/* ================================================= */}

            {/* SOURCE SUMMARY                                    */}

            {/* ================================================= */}

            <section className="section">

              <h2>Source Code Summary</h2>

              <div className="summary-grid">

                <div>

                  <span>TypeScript Files</span>

                  <strong>

                    {data.sourceSummary

                      ?.typescriptFiles ?? 0}

                  </strong>

                </div>

                <div>

                  <span>JavaScript Files</span>

                  <strong>

                    {data.sourceSummary

                      ?.javascriptFiles ?? 0}

                  </strong>

                </div>

                <div>

                  <span>Code Lines</span>

                  <strong>

                    {data.sourceSummary?.codeLines ?? 0}

                  </strong>

                </div>

                <div>

                  <span>Blank Lines</span>

                  <strong>

                    {data.sourceSummary?.blankLines ?? 0}

                  </strong>

                </div>

                <div>

                  <span>Comments</span>

                  <strong>

                    {data.sourceSummary

                      ?.commentLines ?? 0}

                  </strong>

                </div>

                <div>

                  <span>Imports</span>

                  <strong>

                    {data.sourceSummary?.imports ?? 0}

                  </strong>

                </div>

                <div>

                  <span>Exports</span>

                  <strong>

                    {data.sourceSummary?.exports ?? 0}

                  </strong>

                </div>

                <div>

                  <span>TODO</span>

                  <strong>

                    {data.sourceSummary?.todoCount ?? 0}

                  </strong>

                </div>

                <div>

                  <span>FIXME</span>

                  <strong>

                    {data.sourceSummary?.fixmeCount ?? 0}

                  </strong>

                </div>

                <div>

                  <span>Average Complexity</span>

                  <strong>

                    {data.sourceSummary

                      ?.averageComplexityPerFile ?? 0}

                  </strong>

                </div>

              </div>

            </section>

            {/* ================================================= */}

            {/* GIT ACTIVITY                                      */}

            {/* ================================================= */}

            <section className="section">

              <h2>Git Activity</h2>

              <div className="card-grid">

                <div className="activity-card added">

                  <span>Files Added</span>

                  <strong>

                    {data.gitSummary?.filesAdded ?? 0}

                  </strong>

                </div>

                <div className="activity-card modified">

                  <span>Files Modified</span>

                  <strong>

                    {data.gitSummary?.filesModified ?? 0}

                  </strong>

                </div>

                <div className="activity-card deleted">

                  <span>Files Deleted</span>

                  <strong>

                    {data.gitSummary?.filesDeleted ?? 0}

                  </strong>

                </div>

                <div className="activity-card renamed">

                  <span>Files Renamed</span>

                  <strong>

                    {data.gitSummary?.filesRenamed ?? 0}

                  </strong>

                </div>

              </div>

            </section>

            {/* ================================================= */}

            {/* FILES CHANGED BY TYPE                             */}

            {/* ================================================= */}

            <section className="chart-container">

              <h2 className="chart-title">

                Files Changed by Type

              </h2>

              <ResponsiveContainer

                width="100%"

                height={300}

              >

                <BarChart data={gitActivityData}>

                  <CartesianGrid strokeDasharray="3 3" />

                  <XAxis dataKey="name" />

                  <YAxis allowDecimals={false} />

                  <Tooltip />

                  <Bar

                    dataKey="value"

                    name="Files"

                  />

                </BarChart>

              </ResponsiveContainer>

            </section>

            {/* ================================================= */}

            {/* COMPLEXITY                                        */}

            {/* ================================================= */}

            <section className="chart-container">

              <h2 className="chart-title">

                Code Complexity by File

              </h2>

              <ResponsiveContainer

                width="100%"

                height={300}

              >

                <BarChart data={complexityData}>

                  <CartesianGrid strokeDasharray="3 3" />

                  <XAxis dataKey="name" />

                  <YAxis allowDecimals={false} />

                  <Tooltip />

                  <Bar

                    dataKey="complexity"

                    name="Complexity"

                  />

                </BarChart>

              </ResponsiveContainer>

            </section>

            {/* ================================================= */}

            {/* HOTSPOT CHART                                     */}

            {/* ================================================= */}

            <section className="chart-container">

              <h2 className="chart-title">

                Hotspot Score by File

              </h2>

              <ResponsiveContainer

                width="100%"

                height={300}

              >

                <BarChart data={hotspotData}>

                  <CartesianGrid strokeDasharray="3 3" />

                  <XAxis dataKey="name" />

                  <YAxis allowDecimals={false} />

                  <Tooltip />

                  <Bar

                    dataKey="score"

                    name="Hotspot Score"

                  />

                </BarChart>

              </ResponsiveContainer>

            </section>

            {/* ================================================= */}

            {/* COMMIT TIMELINE CHART                             */}

            {/* ================================================= */}

            <section className="chart-container">

              <h2 className="chart-title">

                Repository Commit Timeline

              </h2>

              <ResponsiveContainer

                width="100%"

                height={320}

              >

                <BarChart data={commitTimelineData}>

                  <CartesianGrid strokeDasharray="3 3" />

                  <XAxis dataKey="name" />

                  <YAxis allowDecimals={false} />

                  <Tooltip />

                  <Bar

                    dataKey="linesAdded"

                    name="Lines Added"

                  />

                  <Bar

                    dataKey="linesRemoved"

                    name="Lines Removed"

                  />

                </BarChart>

              </ResponsiveContainer>

            </section>

            {/* ================================================= */}

            {/* COMMIT TIMELINE DETAILS                           */}

            {/* ================================================= */}

            <section className="section">

              <h2>Commit Timeline Details</h2>

              {commitTimeline.length > 0 ? (

                <div className="table-wrapper">

                  <table>

                    <thead>

                      <tr>

                        <th>Commit</th>

                        <th>Author</th>

                        <th>Date</th>

                        <th>Message</th>

                        <th>Files Changed</th>

                        <th>Lines Added</th>

                        <th>Lines Removed</th>

                        <th>Lines Changed</th>

                      </tr>

                    </thead>

                    <tbody>

                      {commitTimeline.map(

                        (commit, index) => (

                          <tr

                            key={

                              commit.commitId ?? index

                            }

                          >

                            <td>

                              <strong>

                                {commit.shortCommitId ??

                                  "Unknown"}

                              </strong>

                            </td>

                            <td>

                              {commit.author ?? "Unknown"}

                            </td>

                            <td>

                              {commit.date ?? "Unknown"}

                            </td>

                            <td>

                              {commit.message ??

                                "No message"}

                            </td>

                            <td>

                              {commit.filesChanged ?? 0}

                            </td>

                            <td>

                              {commit.linesAdded ?? 0}

                            </td>

                            <td>

                              {commit.linesRemoved ?? 0}

                            </td>

                            <td>

                              {commit.linesChanged ?? 0}

                            </td>

                          </tr>

                        )

                      )}

                    </tbody>

                  </table>

                </div>

              ) : (

                <p className="empty-message">

                  No commit timeline data available.

                </p>

              )}

            </section>

            {/* ================================================= */}

            {/* CONTRIBUTOR ACTIVITY                             */}

            {/* ================================================= */}

            <section className="chart-container">

              <h2 className="chart-title">

                Developer / Contributor Activity

              </h2>

              <ResponsiveContainer

                width="100%"

                height={320}

              >

                <BarChart data={contributorActivityData}>

                  <CartesianGrid strokeDasharray="3 3" />

                  <XAxis dataKey="author" />

                  <YAxis allowDecimals={false} />

                  <Tooltip />

                  <Bar

                    dataKey="commits"

                    name="Commits"

                  />

                </BarChart>

              </ResponsiveContainer>

            </section>

            {/* ================================================= */}

            {/* TOP CODE HOTSPOTS                                 */}

            {/* ================================================= */}

            <section className="section">

              <h2>🔥 Top Code Hotspots</h2>

              {data.hotspots &&

              data.hotspots.length > 0 ? (

                <div className="hotspot-list">

                  {data.hotspots.map((item, index) => (

                    <div

                      className="hotspot-card"

                      key={item.path ?? index}

                      onClick={() =>
                        analyzeFile(item.path ?? item.file ?? "")
                      }

                      style={{ cursor: "pointer" }}

                    >

                      <div className="hotspot-header">

                        <div>

                          <h3>

                            {item.file ??

                              "Unknown file"}

                          </h3>

                          <p>

                            {item.path ?? ""}

                          </p>

                        </div>

                        <span

                          className={`category ${getCategoryClass(

                            item.hotspotCategory

                          )}`}

                        >

                          {item.hotspotCategory ??

                            "LOW"}

                        </span>

                      </div>

                      <div className="hotspot-score">

                        <strong>

                          Hotspot Score:{" "}

                          {item.hotspotScore ?? 0}

                        </strong>

                      </div>

                      <div className="hotspot-explanation">

                        <h4>

                          Why this file needs attention

                        </h4>

                        {item.hotspotReasons &&

                        item.hotspotReasons.length > 0 ? (

                          <ul>

                            {item.hotspotReasons.map(

                              (reason, reasonIndex) => (

                                <li

                                  key={reasonIndex}

                                >

                                  {reason}

                                </li>

                              )

                            )}

                          </ul>

                        ) : (

                          <p>

                            No specific hotspot

                            indicators were detected.

                          </p>

                        )}

                      </div>

                      {/* ======================================= */}

                      {/* HOTSPOT METRICS                         */}

                      {/* ======================================= */}

                      <div className="hotspot-metrics">

                        <div>

                          <span>Lines</span>

                          <strong>

                            {item.lines ?? 0}

                          </strong>

                        </div>

                        <div>

                          <span>Functions</span>

                          <strong>

                            {item.functions ?? 0}

                          </strong>

                        </div>

                        <div>

                          <span>Complexity</span>

                          <strong>

                            {item.complexity ?? 0}

                          </strong>

                        </div>

                        <div>

                          <span>Git Changes</span>

                          <strong>

                            {getGitChangeCount(item)}

                          </strong>

                        </div>

                        <div>

                          <span>Git Churn</span>

                          <strong>

                            {getGitChurn(item)}

                          </strong>

                        </div>

                      </div>

                      <button
                        type="button"
                        onClick={(event) => {
                          event.stopPropagation();
                          analyzeFile(item.path ?? item.file ?? "");
                        }}
                      >
                        View File Details
                      </button>

                    </div>

                  ))}

                </div>

              ) : (

                <p className="empty-message">

                  No hotspots detected.

                </p>

              )}

            </section>

            {/* ================================================= */}

            {/* MAINTENANCE CANDIDATES                            */}

            {/* ================================================= */}

            <section className="section">

              <h2>Maintenance Candidates</h2>

              {data.maintenanceCandidates &&

              data.maintenanceCandidates.length > 0 ? (

                <div className="maintenance-list">

                  {data.maintenanceCandidates.map(

                    (item, index) => (

                      <div

                        className="maintenance-card"

                        key={item.path ?? index}

                      >

                        <div>

                          <h3>

                            {item.file ??

                              "Unknown file"}

                          </h3>

                          <p>

                            {item.path ?? ""}

                          </p>

                        </div>

                        <div>

                          <strong>

                            Score:{" "}

                            {item.maintenanceScore ??

                              0}

                          </strong>

                          <span

                            className={`category ${getCategoryClass(

                              item.maintenanceCategory

                            )}`}

                          >

                            {item.maintenanceCategory ??

                              "MINIMAL"}

                          </span>

                        </div>

                      </div>

                    )

                  )}

                </div>

              ) : (

                <p className="empty-message">

                  No maintenance candidates detected.

                </p>

              )}

            </section>

            {/* ================================================= */}

            {/* FILE INTELLIGENCE DETAILS                        */}

            {/* ================================================= */}

            {selectedFile && (

              <section className="section">

                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    gap: "16px",
                    flexWrap: "wrap",
                  }}
                >
                  <div>
                    <h2>File Intelligence Details</h2>
                    <p>{selectedFile}</p>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setSelectedFile("");
                      setFileDetails(null);
                      setFileError("");
                    }}
                  >
                    Close
                  </button>
                </div>

                {fileLoading && (
                  <p className="empty-message">
                    Analyzing selected file...
                  </p>
                )}

                {fileError && (
                  <div className="error-message">{fileError}</div>
                )}

                {fileDetails && !fileLoading && (
                  <>
                    <div className="card-grid">
                      <div className="metric-card"><span>Lines</span><strong>{fileDetails.source?.lines ?? 0}</strong></div>
                      <div className="metric-card"><span>Functions</span><strong>{fileDetails.source?.functions ?? 0}</strong></div>
                      <div className="metric-card"><span>Complexity</span><strong>{fileDetails.source?.complexity ?? 0}</strong></div>
                      <div className="metric-card"><span>React Components</span><strong>{fileDetails.source?.reactComponents ?? 0}</strong></div>
                      <div className="metric-card"><span>Git Changes</span><strong>{fileDetails.git?.changeCount ?? 0}</strong></div>
                      <div className="metric-card"><span>Git Churn</span><strong>{fileDetails.git?.churn ?? 0}</strong></div>
                      <div className="metric-card"><span>Hotspot Score</span><strong>{fileDetails.hotspotScore ?? 0}</strong></div>
                      <div className="metric-card"><span>Maintenance Score</span><strong>{fileDetails.maintenanceScore ?? 0}</strong></div>
                    </div>

                    <div className="summary-grid">
                      <div><span>Complexity Category</span><strong>{fileDetails.source?.complexityCategory ?? "UNKNOWN"}</strong></div>
                      <div><span>Hotspot Category</span><strong>{fileDetails.hotspotCategory ?? "LOW"}</strong></div>
                      <div><span>Maintenance Category</span><strong>{fileDetails.maintenanceCategory ?? "MINIMAL"}</strong></div>
                      <div><span>Lines Added</span><strong>{fileDetails.git?.linesAdded ?? 0}</strong></div>
                      <div><span>Lines Removed</span><strong>{fileDetails.git?.linesRemoved ?? 0}</strong></div>
                      <div><span>Contributors</span><strong>{fileDetails.git?.contributors?.length ?? 0}</strong></div>
                      <div><span>TODO</span><strong>{fileDetails.source?.todoCount ?? 0}</strong></div>
                      <div><span>FIXME</span><strong>{fileDetails.source?.fixmeCount ?? 0}</strong></div>
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "20px", marginTop: "20px" }}>
                      <div>
                        <h3>Why this file needs attention</h3>
                        {(fileDetails.hotspotReasons ?? []).length > 0 ? (
                          <ul>{(fileDetails.hotspotReasons ?? []).map((reason, index) => <li key={`hotspot-${index}`}>{reason}</li>)}</ul>
                        ) : (
                          <p>No strong hotspot signals were detected.</p>
                        )}
                      </div>

                      <div>
                        <h3>Maintenance signals</h3>
                        {(fileDetails.maintenanceReasons ?? []).length > 0 ? (
                          <ul>{(fileDetails.maintenanceReasons ?? []).map((reason, index) => <li key={`maintenance-${index}`}>{reason}</li>)}</ul>
                        ) : (
                          <p>No strong maintenance signals were detected.</p>
                        )}
                      </div>
                    </div>

                    <div style={{ marginTop: "20px" }}>
                      <h3>Recommendations</h3>
                      {(fileDetails.recommendations ?? []).length > 0 ? (
                        <ul>{(fileDetails.recommendations ?? []).map((recommendation, index) => <li key={`recommendation-${index}`}>{recommendation}</li>)}</ul>
                      ) : (
                        <p>No file-specific recommendations were generated.</p>
                      )}
                    </div>

                    <div style={{ marginTop: "20px" }}>
                      <h3>Git Contributors</h3>
                      {(fileDetails.git?.contributors ?? []).length > 0 ? (
                        <ul>{(fileDetails.git?.contributors ?? []).map((contributor, index) => <li key={`contributor-${index}`}>{contributor}</li>)}</ul>
                      ) : (
                        <p>No contributor information was found.</p>
                      )}
                    </div>

                    {fileDetails.git?.latestCommit &&
                      Object.keys(fileDetails.git.latestCommit).length > 0 && (
                        <div style={{ marginTop: "20px" }}>
                          <h3>Latest Commit Affecting This File</h3>
                          <pre
                            style={{
                              whiteSpace: "pre-wrap",
                              overflowX: "auto",
                            }}
                          >
                            {JSON.stringify(
                              fileDetails.git.latestCommit,
                              null,
                              2
                            )}
                          </pre>
                        </div>
                      )}
                  </>
                )}
              </section>
            )}

            {/* ================================================= */}

            {/* FILE INTELLIGENCE                                 */}

            {/* ================================================= */}

            <section className="section">

              <h2>File Intelligence</h2>

              <div className="table-wrapper">

                <table>

                  <thead>

                    <tr>

                      <th>File</th>

                      <th>Lines</th>

                      <th>Functions</th>

                      <th>Complexity</th>

                      <th>Git Changes</th>

                      <th>Churn</th>

                      <th>Hotspot</th>

                      <th>Maintenance</th>

                      <th>Details</th>

                    </tr>

                  </thead>

                  <tbody>

                    {(data.fileIntelligence ?? []).map(

                      (item, index) => (

                        <tr

                          key={

                            item.path ?? index

                          }



                          onClick={() =>
                            analyzeFile(item.path ?? item.file ?? "")
                          }

                          style={{ cursor: "pointer" }}

                        >

                          <td>

                            <strong>

                              {item.file ??

                                "Unknown"}

                            </strong>

                            <small>

                              {item.path ?? ""}

                            </small>

                          </td>

                          <td>

                            {item.lines ?? 0}

                          </td>

                          <td>

                            {item.functions ?? 0}

                          </td>

                          <td>

                            <span

                              className={`category ${getCategoryClass(

                                item.complexityCategory

                              )}`}

                            >

                              {item.complexity ?? 0}

                            </span>

                          </td>

                          <td>

                            {getGitChangeCount(item)}

                          </td>

                          <td>

                            {getGitChurn(item)}

                          </td>

                          <td>

                            <span

                              className={`category ${getCategoryClass(

                                item.hotspotCategory

                              )}`}

                            >

                              {item.hotspotScore ?? 0}

                            </span>

                          </td>

                          <td>

                            <span

                              className={`category ${getCategoryClass(

                                item.maintenanceCategory

                              )}`}

                            >

                              {item.maintenanceScore ??

                                0}

                            </span>

                          </td>



                          <td>

                            <button
                              type="button"
                              onClick={(event) => {
                                event.stopPropagation();
                                analyzeFile(item.path ?? item.file ?? "");
                              }}
                            >
                              View Details
                            </button>

                          </td>                        </tr>

                      )

                    )}

                  </tbody>

                </table>

              </div>

            </section>

            {/* ================================================= */}

            {/* ================================================= */}
            {/* CODE EXPLORER                                     */}
            {/* ================================================= */}
            <section className="section">
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  gap: "16px",
                  flexWrap: "wrap",
                  marginBottom: "16px",
                }}
              >
                <div>
                  <h2 style={{ marginBottom: "6px" }}>Code Explorer</h2>
                  <p style={{ margin: 0, color: "#666" }}>
                    Browse repository source files and inspect their actual code.
                  </p>
                </div>
                {explorerFile && (
                  <button type="button" onClick={() => { setExplorerFile(""); setExplorerDetails(null); setExplorerError(""); }}>
                    Close Explorer
                  </button>
                )}
              </div>

              {explorerFiles.length === 0 ? (
                <p className="empty-message">No source files are available for the Code Explorer.</p>
              ) : (
                <div style={{ display: "grid", gridTemplateColumns: "280px minmax(0, 1fr)", minHeight: "520px", border: "1px solid #ddd", borderRadius: "12px", overflow: "hidden", background: "#fff" }}>
                  <aside style={{ borderRight: "1px solid #ddd", background: "#fafafa", overflowY: "auto" }}>
                    <div style={{ padding: "14px 16px", borderBottom: "1px solid #ddd", fontWeight: 700 }}>
                      Repository Files ({explorerFiles.length})
                    </div>
                    <div style={{ padding: "8px" }}>
                      {explorerFiles.map((filePath) => {
                        const isSelected = explorerFile === filePath;
                        const fileName = filePath.split(/[\/]/).pop() ?? filePath;
                        return (
                          <button key={filePath} type="button" onClick={() => loadSourceFile(filePath)} title={filePath} style={{ display: "block", width: "100%", textAlign: "left", border: "1px solid transparent", borderRadius: "8px", padding: "10px 12px", marginBottom: "4px", cursor: "pointer", background: isSelected ? "#eaf2ff" : "transparent", borderColor: isSelected ? "#9bbcf5" : "transparent" }}>
                            <div style={{ fontWeight: isSelected ? 700 : 500 }}>📄 {fileName}</div>
                            <div style={{ fontSize: "12px", color: "#777", marginTop: "3px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{filePath}</div>
                          </button>
                        );
                      })}
                    </div>
                  </aside>

                  <div style={{ minWidth: 0, display: "flex", flexDirection: "column" }}>
                    {!explorerFile && !explorerLoading && !explorerError && (
                      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "40px", color: "#777", textAlign: "center" }}>
                        <div>
                          <h3 style={{ marginTop: 0, color: "#333" }}>Select a source file</h3>
                          <p style={{ marginBottom: 0 }}>Choose a file from the repository list to load its actual source code.</p>
                        </div>
                      </div>
                    )}

                    {explorerLoading && <div style={{ padding: "24px" }}><p className="empty-message">Loading source code for {explorerFile}...</p></div>}
                    {explorerError && !explorerLoading && <div style={{ padding: "24px" }}><div className="error-message">{explorerError}</div></div>}

                    {explorerDetails && !explorerLoading && !explorerError && (
                      <>
                        <div style={{ padding: "16px", borderBottom: "1px solid #ddd", background: "#fafafa" }}>
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "16px", flexWrap: "wrap" }}>
                            <div style={{ minWidth: 0 }}>
                              <h3 style={{ margin: 0, overflowWrap: "anywhere" }}>{explorerDetails.file ?? explorerFile}</h3>
                              <p style={{ margin: "5px 0 0", color: "#666" }}>{explorerDetails.repositoryPath ?? repositoryPath}</p>
                            </div>
                            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                              <span className="branch-badge">.{explorerDetails.extension ?? "source"}</span>
                              <span className="branch-badge">{explorerDetails.lines ?? sourceLines.length} lines</span>
                              <span className="branch-badge">{formatBytes(explorerDetails.sizeBytes)}</span>
                            </div>
                          </div>
                        </div>

                        <div style={{ flex: 1, minHeight: 0, overflow: "auto", background: "#111827", color: "#e5e7eb" }}>
                          <pre style={{ margin: 0, padding: "16px 0", minWidth: "max-content", fontFamily: "Consolas, Monaco, 'Courier New', monospace", fontSize: "13px", lineHeight: 1.6 }}>
                            {sourceLines.map((line, index) => (
                              <div key={index} style={{ display: "grid", gridTemplateColumns: `${Math.max(3, String(sourceLines.length).length)}ch minmax(0, 1fr)`, columnGap: "20px", paddingRight: "24px" }}>
                                <span style={{ color: "#6b7280", textAlign: "right", userSelect: "none" }}>{index + 1}</span>
                                <span style={{ whiteSpace: "pre" }}>{line || " "}</span>
                              </div>
                            ))}
                          </pre>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              )}
            </section>

            {/* REPOSITORY HEALTH                                 */}

            {/* ================================================= */}

            <section className="section">

              <h2>Repository Health</h2>

              <div className="health-grid">

                <div>

                  <span>Status</span>

                  <strong>

                    {data.repositoryHealth?.status ??

                      "UNKNOWN"}

                  </strong>

                </div>

                <div>

                  <span>High Complexity Files</span>

                  <strong>

                    {data.repositoryHealth

                      ?.filesWithHighComplexity ?? 0}

                  </strong>

                </div>

                <div>

                  <span>Large Files</span>

                  <strong>

                    {data.repositoryHealth?.largeFiles ??

                      0}

                  </strong>

                </div>

                <div>

                  <span>High Churn Files</span>

                  <strong>

                    {data.repositoryHealth

                      ?.highChurnFiles ?? 0}

                  </strong>

                </div>

                <div>

                  <span>

                    Frequently Changed Files

                  </span>

                  <strong>

                    {data.repositoryHealth

                      ?.frequentlyChangedFiles ?? 0}

                  </strong>

                </div>

                <div>

                  <span>High Hotspot Files</span>

                  <strong>

                    {data.repositoryHealth

                      ?.highHotspotFiles ?? 0}

                  </strong>

                </div>

                <div>

                  <span>Maintenance Candidates</span>

                  <strong>

                    {data.repositoryHealth

                      ?.maintenanceCandidates ?? 0}

                  </strong>

                </div>

                <div>

                  <span>Total Complexity</span>

                  <strong>

                    {data.repositoryHealth

                      ?.totalComplexity ?? 0}

                  </strong>

                </div>

              </div>

              {data.repositoryHealth

                ?.statusDescription && (

                <p className="health-description">

                  {

                    data.repositoryHealth

                      .statusDescription

                  }

                </p>

              )}

            </section>

          </>

        )}

      </main>

    </div>

  );

}

export default App;