source backend/.venv/bin/activate
cd backend && uvicorn main:app --reload &
cd numerical-methods && npm i 
npm run dev &