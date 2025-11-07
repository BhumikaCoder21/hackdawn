import React, { useState } from "react";

export default function CropCheck() {
  const [files, setFiles] = useState([]);
  const [cropType, setCropType] = useState("");
  const [loading, setLoading] = useState(false);
  const [res, setRes] = useState(null);
  const [err, setErr] = useState("");

  const API = process.env.REACT_APP_AI_URL || "http://localhost:8000";

  async function analyze() {
    if (!files.length) return;
    setLoading(true);
    setErr("");
    setRes(null);

    const fd = new FormData();
    fd.append("image", files[0]); // single image
    fd.append("cropType", cropType || "unknown");

    try {
      const r = await fetch(`${API}/api/crop-check`, { method: "POST", body: fd });

      const ct = r.headers.get("content-type") || "";
      if (!ct.includes("application/json")) {
        const txt = await r.text();
        throw new Error(`Unexpected response: ${txt.slice(0, 200)}`);
      }

      const json = await r.json();
      setRes(json);
    } catch (e) {
      console.error(e);
      setErr(String(e.message || e));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-3">🌾 AI Crop Checker</h1>
      <p className="text-gray-600 mb-6">
        Upload a clear leaf photo to detect crop health issues and get actionable suggestions.
      </p>

      <div className="grid gap-3">
        <input
          type="text"
          placeholder="e.g., tomato, rice, wheat"
          value={cropType}
          onChange={(e) => setCropType(e.target.value)}
          className="border rounded px-3 py-2 focus:ring-2 focus:ring-green-400"
        />
        <input
          type="file"
          accept="image/*"
          multiple={false}
          onChange={(e) => setFiles([...e.target.files])}
          className="border rounded px-3 py-2"
        />

        {/* tiny preview */}
        {files.length > 0 && (
          <div className="mt-1">
            <img
              src={URL.createObjectURL(files[0])}
              alt="preview"
              className="w-28 h-28 object-cover rounded border"
            />
          </div>
        )}

        <button
          onClick={analyze}
          disabled={loading || !files.length}
          className="bg-green-600 hover:bg-green-700 text-white font-semibold px-5 py-2 rounded disabled:opacity-50"
        >
          {loading ? "Analyzing..." : "Analyze"}
        </button>
      </div>

      {err && (
        <div className="mt-4 border border-red-200 bg-red-50 text-red-700 rounded p-3 text-sm">
          {err}
        </div>
      )}

      {res && (
        <div className="mt-8 border rounded-lg p-5 bg-white shadow">
          <div className="flex items-center gap-2 mb-2">
            <span
              className={`inline-block h-3 w-3 rounded-full ${
                res.is_healthy ? "bg-emerald-500" : "bg-amber-500"
              }`}
            />
            <h2 className="text-xl font-semibold">
              {res.is_healthy ? "✅ Healthy Crop" : "⚠️ Issue Detected"}
            </h2>
          </div>

          {/* Low-confidence hint */}
          {res?.top_conditions?.[0]?.confidence < 0.6 && (
            <p className="mt-2 text-amber-700 bg-amber-50 border border-amber-200 rounded p-2 text-sm">
              Low confidence. Retake 2–3 clear photos (single leaf, bright even light) for better suggestions.
            </p>
          )}

          {/* Possible conditions with bars */}
          {Array.isArray(res.top_conditions) && res.top_conditions.length > 0 && (
            <div className="mt-4">
              <h3 className="font-medium">Possible Conditions</h3>
              <ul className="mt-2 space-y-2">
                {res.top_conditions.map((c, i) => {
                  const pct = Math.max(4, Math.round((c.confidence || 0) * 100));
                  return (
                    <li key={i}>
                      <div className="flex justify-between text-sm">
                        <span className="font-medium capitalize">{c.label}</span>
                        <span>{pct}%</span>
                      </div>
                      <div className="h-2 bg-gray-200 rounded">
                        <div
                          className="h-2 bg-emerald-600 rounded"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>
          )}

          {/* Solutions & Suggestions */}
          <div className="mt-5">
            <h3 className="font-medium">Solutions & Suggestions</h3>
            {Array.isArray(res.advice) && res.advice.length > 0 ? (
              <ul className="mt-2 list-disc pl-5 text-gray-700 space-y-1">
                {res.advice.map((a, i) => (
                  <li key={i}>{a}</li>
                ))}
              </ul>
            ) : (
              <p className="mt-2 text-gray-600">
                No suggestions returned. Try a clearer photo and re-check.
              </p>
            )}

            <div className="mt-3 flex gap-2">
              <button
                onClick={() => navigator.clipboard.writeText((res.advice || []).join("\n"))}
                className="border px-3 py-1.5 rounded hover:bg-gray-50"
              >
                Copy steps
              </button>
              <button
                onClick={() => analyze()}
                className="border px-3 py-1.5 rounded hover:bg-gray-50"
                disabled={loading}
              >
                Re-check
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}