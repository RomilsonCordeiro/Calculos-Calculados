// --- Seleção de Elementos do DOM ---
const display = document.querySelector(".resultado");
const buttons = document.querySelectorAll("button");

// --- Variáveis de Estado da Calculadora ---
let currentOperand = "0"; // Operando exibido no visor.
let previousOperand = null; // Operando anterior, armazenado para cálculo.
let operation = null; // Operação matemática a ser executada.
let shouldResetDisplay = false; // Flag para resetar o visor após uma operação.
const MAX_DIGITS = 13; // Constante para o limite máximo de dígitos.

// --- Funções Principais ---

/**
 * Atualiza o conteúdo de texto do elemento de exibição (display).
 */
const updateDisplay = () => {
  display.textContent = currentOperand;
};

/**
 * Roteia a ação com base no valor do botão clicado.
 * @param {string} value - O texto do conteúdo do botão (ex: '7', '+', 'CE').
 */
const handleButtonClick = (value) => {
  if (!isNaN(value)) {
    appendNumber(value);
  } else if (value === ".") {
    appendPoint();
  } else if (value === "C") {
    deleteLast();
  } else if (value === "CE") {
    clearAll();
  } else if (value === "=") {
    evaluate();
  } else {
    setOperation(value);
  }
  updateDisplay();
};

/**
 * Anexa um dígito numérico ao operando atual, respeitando o limite de dígitos.
 * @param {string} number - O número a ser anexado.
 */
const appendNumber = (number) => {
  // Impede a digitação de mais números se o limite for atingido.
  if (currentOperand.length >= MAX_DIGITS && !shouldResetDisplay) {
    return;
  }
  if (currentOperand === "0" || shouldResetDisplay) {
    currentOperand = number;
    shouldResetDisplay = false;
  } else {
    currentOperand += number;
  }
};

/**
 * Anexa um ponto decimal ao operando atual, se não existir um.
 */
const appendPoint = () => {
  // Impede a adição do ponto se o limite for atingido.
  if (currentOperand.length >= MAX_DIGITS && !shouldResetDisplay) {
    return;
  }
  if (shouldResetDisplay) {
    currentOperand = "0.";
    shouldResetDisplay = false;
    return;
  }
  if (!currentOperand.includes(".")) {
    currentOperand += ".";
  }
};

/**
 * Remove o último caractere do operando atual (função de backspace).
 */
const deleteLast = () => {
  currentOperand = currentOperand.toString().slice(0, -1);
  if (currentOperand === "") {
    currentOperand = "0";
  }
};

/**
 * Reseta todas as variáveis de estado para seus valores iniciais.
 */
const clearAll = () => {
  currentOperand = "0";
  previousOperand = null;
  operation = null;
  shouldResetDisplay = false;
};

/**
 * Define a operação matemática e armazena o operando atual.
 * @param {string} op - O operador ('+', '-', 'x', '÷').
 */
const setOperation = (op) => {
  if (operation !== null) {
    evaluate();
  }
  previousOperand = currentOperand;
  operation = op;
  shouldResetDisplay = true;
};

/**
 * Formata um número para caber no limite de dígitos do visor.
 * @param {number} num - O número a ser formatado.
 * @returns {string} O número formatado como string.
 */
const formatResult = (num) => {
  let numString = num.toString();

  if (numString.length <= MAX_DIGITS) {
    return numString;
  }

  // Se o número for muito grande, usa notação exponencial.
  if (Math.abs(num) >= Math.pow(10, MAX_DIGITS)) {
    return num.toExponential(MAX_DIGITS - 6); // Ajusta precisão da notação
  }

  // Se for um decimal longo, arredonda para caber no visor.
  const integerPartLength = Math.trunc(num).toString().length;
  const availableDecimalPlaces = MAX_DIGITS - integerPartLength - 1; // -1 para o ponto
  return num.toFixed(Math.max(0, availableDecimalPlaces));
};

/**
 * Executa o cálculo e formata o resultado.
 */
const evaluate = () => {
  if (operation === null || shouldResetDisplay) {
    return;
  }
  if (operation === "÷" && currentOperand === "0") {
    alert("Erro: Divisão por zero.");
    clearAll();
    return;
  }
  const a = parseFloat(previousOperand);
  const b = parseFloat(currentOperand);

  const result = calculate(a, b, operation);

  // Formata o resultado para respeitar o limite de dígitos.
  currentOperand = formatResult(result);

  operation = null;
  shouldResetDisplay = true;
};

/**
 * Realiza uma operação matemática entre dois números.
 * @param {number} num1 - O primeiro número.
 * @param {number} num2 - O segundo número.
 * @param {string} operator - O operador a ser aplicado.
 * @returns {number | null} O resultado do cálculo.
 */
const calculate = (num1, num2, operator) => {
  switch (operator) {
    case "+":
      return num1 + num2;
    case "-":
      return num1 - num2;
    case "x":
      return num1 * num2;
    case "÷":
      return num1 / num2;
    default:
      return null;
  }
};

// --- Inicialização ---

// Adiciona o manipulador de eventos a todos os botões.
buttons.forEach((button) => {
  button.addEventListener("click", () => handleButtonClick(button.textContent));
});

// Define o estado inicial do visor ao carregar a página.
updateDisplay();
