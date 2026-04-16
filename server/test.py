import os
from openai import OpenAI
from dotenv import load_dotenv

# Force correct env load
load_dotenv(dotenv_path=".env", override=True)

api_key = os.getenv("OPENAI_API_KEY")

print("FULL KEY:", api_key)  # MUST start with AIza

client = OpenAI(
    api_key=api_key,
    base_url="https://generativelanguage.googleapis.com/v1beta/openai/"
)

try:
    response = client.chat.completions.create(
        model="gemini-2.5-flash",  # ✅ safest
        messages=[
            {"role": "user", "content": "What is React?"}
        ]
    )

    print("\n✅ SUCCESS")
    print("ANSWER:\n", response.choices[0].message.content)

except Exception as e:
    print("\n❌ ERROR:", str(e))