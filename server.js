const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();

app.use(express.json());
app.use(express.static('public'));

const dataFile = path.join(__dirname, 'data', 'surveys.json');

// Получение списка всех опросов (и созданных вами, и пользователем)
app.get('/api/surveys', (req, res) => {
    if (!fs.existsSync(dataFile)) {
        return res.json([]);
    }
    const data = fs.readFileSync(dataFile, 'utf8');
    try {
        const surveys = JSON.parse(data);
        res.json(surveys);
    } catch (e) {
        res.json([]);
    }
});

// Сохранение нового опроса
app.post('/api/surveys', (req, res) => {
    let surveys = [];
    if (fs.existsSync(dataFile)) {
        const data = fs.readFileSync(dataFile, 'utf8');
        try { surveys = JSON.parse(data); } catch (e) {}
    }
    
    const newSurvey = req.body;
    newSurvey.id = Date.now().toString; // уникальный ID
    surveys.push(newSurvey);
    
    // Убедимся, что папка data существует
    const dir = path.dirname(dataFile);
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }

    fs.writeFileSync(dataFile, JSON.stringify(surveys, null, 2));
    res.json({ success: true, id: newSurvey.id });
});

app.listen(3000, () => {
    console.log('Сервер запущен: http://localhost:3000');
});