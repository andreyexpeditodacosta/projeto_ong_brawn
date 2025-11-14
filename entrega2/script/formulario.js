const form = document.getElementById('form');
const nome = document.getElementById('nome');
const email = document.getElementById('email');
const telefone = document.getElementById('telefone');
const cpf = document.getElementById('cpf');
const data = document.getElementById('data');
const rua = document.getElementById('rua');
const cep = document.getElementById('cep');
const cidade = document.getElementById('cidade');
const bairro = document.getElementById('bairro');
const uf = document.getElementById('uf');

// --- Funções de Máscara ---

const maskCPF = (value) => {
    value = value.replace(/\D/g, "");
    value = value.replace(/(\d{3})(\d)/, "$1.$2");
    value = value.replace(/(\d{3})(\d)/, "$1.$2");
    value = value.replace(/(\d{3})(\d{1,2})$/, "$1-$2");
    return value;
};

const maskTelefone = (value) => {
    value = value.replace(/\D/g, "");
    value = value.replace(/^(\d{2})(\d)/g, "($1) $2");
    
    // Máscara para telefone fixo (8 dígitos) e celular (9 dígitos)
    if (value.length <= 14) {
        value = value.replace(/(\d{4})(\d)/, "$1-$2"); // Fixo: (00) 0000-0000
    } else {
        value = value.replace(/(\d{5})(\d)/, "$1-$2"); // Celular: (00) 00000-0000
    }
    
    return value.substring(0, 15);
};

const maskCEP = (value) => {
    value = value.replace(/\D/g, "");
    value = value.replace(/^(\d{5})(\d)/, "$1-$2");
    return value.substring(0, 9);
};

const maskData = (value) => {
    value = value.replace(/\D/g, "");
    value = value.replace(/(\d{2})(\d)/, "$1/$2");
    value = value.replace(/(\d{2})(\d)/, "$1/$2");
    return value.substring(0, 10);
};

// --- Aplicação das Máscaras nos Inputs ---

cpf.addEventListener('input', (e) => {
    e.target.value = maskCPF(e.target.value);
});

telefone.addEventListener('input', (e) => {
    e.target.value = maskTelefone(e.target.value);
});

cep.addEventListener('input', (e) => {
    e.target.value = maskCEP(e.target.value);
});

data.addEventListener('input', (e) => {
    e.target.value = maskData(e.target.value);
});

// --- Funções de Validação e Lógica Principal ---

form.addEventListener('submit', e => {
    e.preventDefault();

    if (validadeInputs()) {
        form.submit();
        alert('Formulário enviado com sucesso!');
    }
});

const setError = (element, message) => {
    const inputControl = element.parentElement;
    const errorDisplay = inputControl.querySelector('.error');

    errorDisplay.innerText = message;
    inputControl.classList.add('error');
    inputControl.classList.remove('success');
};

const setSucces = element => {
    const inputControl = element.parentElement;
    const errorDisplay = inputControl.querySelector('.error');

    errorDisplay.innerText = '';
    inputControl.classList.add('success');
    inputControl.classList.remove('error');
};

const isValidEmail = (email) => {
    const emailPattern = /^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$/;
    return emailPattern.test(email);
};

const isValidCPF = (cpf) => {
    const cpfPattern = /^\d{3}\.\d{3}\.\d{3}\-\d{2}$/; // Verifica formato 000.000.000-00
    return cpfPattern.test(cpf);
};

const isValidCEP = (cep) => {
    const cepPattern = /^\d{5}\-\d{3}$/; // Verifica formato 00000-000
    return cepPattern.test(cep);
};

const isValidTelefone = (telefone) => {
    const fixoPattern = /^\(\d{2}\)\s\d{4}\-\d{4}$/; // (00) 0000-0000
    const celularPattern = /^\(\d{2}\)\s\d{5}\-\d{4}$/; // (00) 00000-0000
    return fixoPattern.test(telefone) || celularPattern.test(telefone);
};

const isValidDate = (dateString) => {
    const datePattern = /^(\d{2})\/(\d{2})\/(\d{4})$/;
    
    if (!datePattern.test(dateString)) {
        return false;
    }

    const [, day, month, year] = dateString.match(datePattern).map(Number);

    if (month < 1 || month > 12) {
        return false;
    }

    const date = new Date(year, month - 1, day);
    const today = new Date();
    
    // Ajusta today para comparar apenas a data (sem a hora atual)
    today.setHours(0, 0, 0, 0); 
    
    if (date.getFullYear() !== year || date.getMonth() !== (month - 1) || date.getDate() !== day) {
        return false;
    }

    // Data não pode ser no futuro ou hoje
    if (date >= today) {
        return false;
    }

    return true;
};

const validadeInputs = () => {
    let formIsValid = true;

    const nomeValue = nome.value.trim();
    const emailValue = email.value.trim();
    const telefoneValue = telefone.value.trim();
    const cpfValue = cpf.value.trim();
    const dataValue = data.value.trim();
    const ruaValue = rua.value.trim();
    const cepValue = cep.value.trim();
    const cidadeValue = cidade.value.trim();
    const bairroValue = bairro.value.trim();
    const ufValue = uf.value.trim();

    // 1. Nome
    if (nomeValue === '') {
        setError(nome, 'Nome é obrigatório');
        formIsValid = false;
    } else {
        setSucces(nome);
    }

    // 2. E-mail
    if (emailValue === '') {
        setError(email, 'E-mail é obrigatório');
        formIsValid = false;
    } else if (!isValidEmail(emailValue)) {
        setError(email, 'Forneça um e-mail válido');
        formIsValid = false;
    } else {
        setSucces(email);
    }

    // 3. Telefone
    if (telefoneValue === '') {
        setError(telefone, 'Telefone é obrigatório');
        formIsValid = false;
    } else if (!isValidTelefone(telefoneValue)) {
        setError(telefone, 'Forneça um telefone válido (Ex: (00) 0000-0000 ou (00) 00000-0000)');
        formIsValid = false;
    } else {
        setSucces(telefone);
    }

    // 4. CPF
    if (cpfValue === '') {
        setError(cpf, 'CPF é obrigatório');
        formIsValid = false;
    } else if (!isValidCPF(cpfValue)) {
        setError(cpf, 'Forneça um CPF válido (Ex: 123.456.789-00)');
        formIsValid = false;
    } else {
        setSucces(cpf);
    }

    // 5. Data de Nascimento
    if (dataValue === '') {
        setError(data, 'Data de Nascimento é obrigatória');
        formIsValid = false;
    } else if (!isValidDate(dataValue)) {
        setError(data, 'Data inválida. Use DD/MM/AAAA e a data deve ser no passado.');
        formIsValid = false;
    } else {
        setSucces(data);
    }

    // 6. Rua
    if (ruaValue === '') {
        setError(rua, 'Rua é obrigatória');
        formIsValid = false;
    } else {
        setSucces(rua);
    }

    // 7. CEP
    if (cepValue === '') {
        setError(cep, 'CEP é obrigatório');
        formIsValid = false;
    } else if (!isValidCEP(cepValue)) {
        setError(cep, 'Forneça um CEP válido (Ex: 00000-000)');
        formIsValid = false;
    } else {
        setSucces(cep);
    }

    // 8. Cidade
    if (cidadeValue === '') {
        setError(cidade, 'Cidade é obrigatória');
        formIsValid = false;
    } else {
        setSucces(cidade);
    }

    // 9. Bairro
    if (bairroValue === '') {
        setError(bairro, 'Bairro é obrigatório');
        formIsValid = false;
    } else {
        setSucces(bairro);
    }

    // 10. UF (Unidade Federativa)
    if (ufValue === '') {
        setError(uf, 'UF é obrigatória');
        formIsValid = false;
    } else if (ufValue.length !== 2) {
        setError(uf, 'UF deve ter 2 letras');
        formIsValid = false;
    } else {
        setSucces(uf);
    }

    return formIsValid;
};