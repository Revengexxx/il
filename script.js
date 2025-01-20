const orderNumberField = document.querySelector('#orderNumberField');
const answerField = document.querySelector('#answerField');
const modalInputValues = $('#modalInputValues');
const minValueField = document.querySelector('#minValueInput');
const maxValueField = document.querySelector('#maxValueInput');

const failAnswerPhrases = [
    "Вы загадали неправильное число!\n\u{1F914}",
    "Я сдаюсь..\n\u{1F92F}",
    "Не повезло, не угадал\n\u{1F622}",
    "Там же не было неправльных ответов?\n\u{1F612}"
];

const nextAnswerPhrases = [
    "Вы загадали число ",
    "Может, ваше число ",
    "И ваше число... ",
    "Это число "
];

const successAnswerPhrases = [
    "Я всегда угадываю\n\u{1F60E}",
    "Это было легко\u{1F61D}",
    "Я выиграл\u{1F607}",
    "Победа за мной\n\u{1F973}",
];

// Перевод числовой записи в пропись
function IntToText(n)
{
    const maxLength = 20;
    let result = "";
    let sign = (Math.abs(n) != n) ? "минус " : "";
    let workNuber = Math.abs(n);

    if (n == 0)
    {
        result = 'ноль';
    }
    else
    {
        const textValues = 
        [
            ["", "один", "два", "три", "четыре", "пять", "шесть", "семь", "восемь", "девять"],
            ["", "десять", "двадцать", "тридцать", "сорок", "пятьдесят", "шестьдесят", "семьдесят", "восемьдесят", "девяносто"],
            ["", "сто", "двести", "тристо", "четыресто", "пятьсот", "шестьсот", "семьсот", "восемьсот", "девятьсот"],
        ];

        let i = 0;

        if ((workNuber % 100 > 10) && (workNuber % 100 < 20))
        {
            workNuber = Math.floor(workNuber / 100);
            i = 2;
        }

        while (workNuber != 0)
        {
            let curDigit = workNuber % 10;
            
            if (curDigit != 0)
                result = textValues[i][curDigit] + (result.length > 0 ? " " : "") + result;
            
            workNuber = Math.floor(workNuber / 10);
            i++;
        }

        result = sign + result;
    }

    return (result.length < maxLength) ? result : n;
}
//Старт/рестарт игры
function Start()
{
    minValue = parseInt(minValueField.value) || 0;
    maxValue = parseInt(maxValueField.value) === 0 ? 0 : parseInt(maxValueField.value) || 100;

    if (minValue > maxValue)
    {
        let b = minValue;
        minValue = maxValue;
        maxValue = b;
    }

    minValue = minValue < -999 ? -999 : minValue;
    maxValue = maxValue > 999 ? 999 : maxValue;    

    answerNumber  = Math.floor((minValue + maxValue) / 2);
    orderNumber = 1;
    gameRun = true;

    orderNumberField.innerText = orderNumber++;
    answerField.innerText = `${nextAnswerPhrases[0]} ${IntToText(answerNumber)}?`;
    
    modalStartAlertText.innerText = `Загадайте любое целое число от ${minValue} до ${maxValue}, а я его угадаю`;
    modalStartAlert.modal("show");
    firstRun = false;
}
// Стартовая форма закрыта
modalInputValues.on('hidden.bs.modal', Start);
// Рестарт программы
document.querySelector('#btnRetry').addEventListener('click', function () {
    modalInputValues.modal("show");
});
// Кнопка больше
document.querySelector('#btnOver').addEventListener('click', function () {
    if (gameRun){
        if (minValue === maxValue){
            const phraseRandom = Math.round( Math.random() * (failAnswerPhrases.length - 1));
            const answerPhrase = failAnswerPhrases[phraseRandom];            
            answerField.innerText = answerPhrase;
            gameRun = false;
        } else {
            minValue = answerNumber + 1;
            answerNumber = Math.floor((minValue + maxValue) / 2);
            orderNumberField.innerText = orderNumber++;            

            const phraseRandom = Math.round( Math.random() * (nextAnswerPhrases.length - 1));
            answerField.innerText = `${nextAnswerPhrases[phraseRandom]} ${IntToText(answerNumber)}?`;
        }
    }
});
// Кнопка меньше
document.querySelector('#btnLess').addEventListener('click', function () {
    if (gameRun){
        if (minValue !== maxValue){ //Продолжить поиск ниже
            maxValue = answerNumber - 1;
            if (maxValue >= minValue)
            {
                answerNumber = Math.ceil((minValue + maxValue) / 2);
                orderNumberField.innerText = orderNumber++;            

                const phraseRandom = Math.round( Math.random() * (nextAnswerPhrases.length - 1));
                answerField.innerText = `${nextAnswerPhrases[phraseRandom]} ${IntToText(answerNumber)}?`;
                return;
            }
        }  
    }
});
// Кнопка Верно!
document.querySelector('#btnEqual').addEventListener('click', function () {
    if (gameRun){
        const phraseRandom = Math.round( Math.random() * (successAnswerPhrases.length - 1));
        answerField.innerText = successAnswerPhrases[phraseRandom];

        gameRun = false;
    }
});
