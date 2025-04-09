
from flask import Flask, request, jsonify
from flask_cors import CORS
from llama_cpp import Llama

app = Flask(__name__)
CORS(app)

llm = Llama(
    model_path="models/deepseek-coder-6.7b.Q4_K_M.gguf",
    n_ctx=2048,
    n_threads=8,
    n_gpu_layers=20
)

@app.route("/grade", methods=["POST"])
def grade():
    data = request.get_json()
    problem = data.get("problem")
    answer = data.get("answer")

    prompt = (
        "You're an elementary school teacher grading a student's math word problem answer.\n\n"
        f"Word Problem: {problem}\n"
        f"Student's Answer: {answer}\n\n"
        "Grade it with one of the following:\n"
        "- Correct\n"
        "- Partially Correct\n"
        "- Incorrect\n\n"
        "Then explain your reasoning in 1-2 sentences like a teacher would."
    )

    result = llm(prompt, max_tokens=300, stop=["</s>"])
    feedback = result["choices"][0]["text"].strip()
    return jsonify({"feedback": feedback})

if __name__ == "__main__":
    app.run(debug=True)
