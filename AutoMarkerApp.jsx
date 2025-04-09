
// Auto-Marker React Frontend (with Tailwind)
import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

export default function AutoMarkerApp() {
  const [problem, setProblem] = useState("");
  const [answer, setAnswer] = useState("");
  const [feedback, setFeedback] = useState("");
  const [loading, setLoading] = useState(false);

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const { createWorker } = await import("tesseract.js");
    const worker = await createWorker({ logger: (m) => console.log(m) });
    await worker.loadLanguage("eng");
    await worker.initialize("eng");

    const {
      data: { text },
    } = await worker.recognize(file);
    await worker.terminate();

    setAnswer(text.trim());
  };

  const handleGradeAnswer = async () => {
    setLoading(true);
    setFeedback("");
    try {
      const res = await fetch("http://localhost:5000/grade", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ problem, answer }),
      });
      const data = await res.json();
      setFeedback(data.feedback);
    } catch (err) {
      console.error("Error grading:", err);
      setFeedback("❌ Error grading the answer. Please check the server and try again.");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white p-6">
      <div className="max-w-3xl mx-auto space-y-6">
        <h1 className="text-4xl font-bold text-center text-blue-800">🧠 Auto-Marker for Teachers</h1>
        <Card>
          <CardContent className="space-y-4 p-6">
            <div>
              <label className="font-medium">Word Problem</label>
              <Textarea value={problem} onChange={(e) => setProblem(e.target.value)} placeholder="Enter the math word problem here" className="mt-1" />
            </div>
            <div>
              <label className="font-medium">Student's Answer</label>
              <Textarea value={answer} onChange={(e) => setAnswer(e.target.value)} placeholder="Enter the student's answer" className="mt-1" />
            </div>
            <div className="flex flex-col space-y-2">
              <label className="font-medium">📷 Upload Image of Student's Work</label>
              <input type="file" accept="image/*" onChange={handleUpload} className="border border-gray-300 p-2 rounded" />
            </div>
            <Button className="w-full text-lg py-6" onClick={handleGradeAnswer} disabled={loading || !problem || !answer}>
              {loading ? <Loader2 className="animate-spin mr-2" /> : "Grade Answer"}
            </Button>
            {feedback && (
              <div className="bg-green-50 border border-green-300 text-green-900 rounded-xl p-4">
                <p className="whitespace-pre-wrap font-mono text-lg">{feedback}</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
