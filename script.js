
const inputSlider = document.querySelector("[data-lengthSlider]");
const lengthDsiplay = document.querySelector("[data-lengthNumber]");
const passwordDsiplay = document.querySelector("[data-passwordDisplay]"); 
const copyBtn = document.querySelector("[data-copy]");
const copyMsg = document.querySelector("[data-copyMsg]");
const uppercaseCheck = document.querySelector("#uppercase");
const lowercaseCheck = document.querySelector("#lowercase");
const numbersCheck = document.querySelector("#numbers");
const symbolsCheck = document.querySelector("#symbols");
const indicator =document.querySelector("[data-indicator]");
const generateBtn = document.querySelector(".generateBtn");
const allCheckBox =document.querySelectorAll("input[type=checkbox]");
const symbols = "!@#$%^&*()_+{}[]|:\"<>,.?/~`";
// [] inlcude custom attribute
// starting values set as default
let password = "";
let passwordLength = 10;
let checkCount = 0;
setIndicator("#ccc");

handleSlider();

function handleSlider(){
    inputSlider.value = passwordLength;
    lengthDsiplay.innerText = passwordLength;

    const min =  inputSlider.min;
    const max = inputSlider.max;
    inputSlider.style.backgroundSize = ( (passwordLength - min)*100 / (max - min)) + "% 100%"
}
function setIndicator(color){
    indicator.style.backgroundColor = color;
    //shadow
    indicator.style.boxShadow = `0 0 12px 1px ${color}`;
}

function getRndInteger(min,max){
    return Math.floor(Math.random() *(max-min) + min);
}

function generateRandomNumber(){
    return getRndInteger(0,9);
}

function generateLowerCase() {
    return String.fromCharCode(getRndInteger(97,123));
}

function generateUpperCase() {
    return String.fromCharCode(getRndInteger(65,91));
}

function generateSymbol() {
    return symbols[getRndInteger(0, symbols.length - 1)];
}

function calcStrength(){
    let hasUpperCase = false;
    let hasLowerCase = false;
    let hasNumber = false;
    let hasSymbol = false;

    if(uppercaseCheck.checked) hasUpperCase = true;
    if(lowercaseCheck.checked) hasLowerCase = true;
    if(numbersCheck.checked) hasNumber = true;
    if(symbolsCheck.checked) hasSymbol = true;

    if(hasUpperCase && hasLowerCase && (hasNumber || hasSymbol) && passwordLength >= 10){
        setIndicator("#0f0");
    }
    else if(
        (hasUpperCase || hasLowerCase) && (hasNumber || hasSymbol) && passwordLength >=8
    ) {
        setIndicator("#ff0");
    }
    else{
        setIndicator("#f00");
    }
};

async function copyContent()
{
    try{
        await navigator.clipboard.writeText(passwordDsiplay.value);
        copyMsg.innerText = "Copied!";
    }
    catch(error){
        copyMsg.innerText = "Failed !";
    }
// to make span visible
    copyMsg.classList.add("active");
    setTimeout(() => {
        copyMsg.classList.remove("active")
    },2000);

}

function shufflePassword(array){
    // fisher yates method
    for(let i = array.length - 1; i >= 0; i--){
        const j = Math.floor(Math.random() *(i+1));
        const temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    let str ="";
    array.forEach((el) => {str += el});
    return str;

}

function handleCheckBoxChange()
{
    checkCount = 0;
    allCheckBox.forEach((checkBox)=> {
        if(checkBox.checked) {
            checkCount++;
        }
    });
    //special case
    if(passwordLength < checkCount) {
        passwordLength = checkCount;
        handleSlider();
    }
}

allCheckBox.forEach( (CheckBox) => {
    CheckBox.addEventListener("change", handleCheckBoxChange);
})

// if slider changes then update value for lengthDsiplay
inputSlider.addEventListener("input", (e) => {
    passwordLength = e.target.value;
    handleSlider();
})
// 
copyBtn.addEventListener("click",() => {
    if(passwordDsiplay.value) 
    {
        copyContent();
    }
});

generateBtn.addEventListener("click",() => {
    if(checkCount <= 0) return;

    console.log("Chl rha hai yahan tk toh 1");

    if(passwordLength < checkCount) {
        passwordLength = checkCount;
        handleSlider();
    }

    password = "";

    let funcArr = [];
    if(uppercaseCheck.checked) funcArr.push(generateUpperCase);
    if(lowercaseCheck.checked) funcArr.push(generateLowerCase);
    if(numbersCheck.checked) funcArr.push(generateRandomNumber);
    if(symbolsCheck.checked) funcArr.push(generateSymbol);
    console.log("Chl rha hai yahan tk toh 2");
    
    //compulsory addition
    for(let i =0;i <funcArr.length; i++) {
        password += funcArr[i]();
    }
    console.log("Chl rha hai yahan tk toh 3");
    for(let i = 0 ; i< passwordLength - funcArr.length; i++)
    {
        let  randIndex = getRndInteger(0,funcArr.length);
        password += funcArr[randIndex]();
    }

    console.log("Chl rha hai yahan tk toh 4");
    //shuffle password
    password = shufflePassword(Array.from(password));
    // show in UI
    passwordDsiplay.value = password;
    //calculate strength of password
    calcStrength();
});

