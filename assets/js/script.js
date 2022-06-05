let form = document.getElementById('form-registration');
let inputName = document.getElementById('name');
let inputEmail = document.getElementById('email');
let cpf = document.getElementById('cpf');
let inputCourse = document.getElementById('course');
let erro = document.querySelector('.alert');
let messageError = document.getElementById('message-error');
let messageSuccess = document.getElementById('success');
let deleteStudent = document.querySelectorAll('#delete');

form.addEventListener('submit', validate);

window.onload = function () {
  if (localStorage.length > 0) {
    let alunosCadastrados = JSON.parse(localStorage.getItem('listaAluno'));
    updateTableStudents(alunosCadastrados);
  }
};

function updateTableStudents(alunos) {
  alunos.forEach(aluno => {
    let studentName = aluno.name;
    let studentEmail = aluno.email;
    let studentCPF = aluno.cpf;
    let studentCourse = aluno.course;
    let tableBody = document.querySelector('.table-body');

    let tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${studentName}</td>
      <td>${studentEmail}</td>
      <td class="cpf-number">${studentCPF}</td>
      <td>${studentCourse}</td>
      <td id="delete" onclick="removeStudent(this)"><div><img src="assets/images/icon-delete.svg" alt="Icon delete"></div></td>
    `;

    tableBody.appendChild(tr);
  });
}

function validate(event) {
  event.preventDefault();

  validateInputs();
}

function validateInputs() {
  erro.classList.add('d-none');

  if (validateName()) {
    if (validateEmail()) {
      if (validateCPF()) {
        if (validateCourse()) {
          if (checkEvenCPF()) {
            registerStudent();
            clearFields();

            setTimeout(() => {
              messageSuccess.classList.add('d-none');
            }, 4000);
          }
        }
      }
    }
  }
}

function validateName() {
  if (inputName.value === '') {
    messageError.innerHTML = 'nome';
    erro.classList.remove('d-none');
    inputName.focus();
    inputName.classList.add('is-invalid');
    return false;
  } else {
    inputName.classList.remove('is-invalid');
    inputName.classList.add('is-valid');
  }
  return true;
}

function validateEmail() {
  if (inputEmail.value === '') {
    messageError.innerHTML = 'email';
    erro.classList.remove('d-none');
    inputEmail.focus();
    inputEmail.classList.add('is-invalid');
    return false;
  } else if (inputEmail.value !== '') {
    let regex =
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (!regex.test(inputEmail.value.toLowerCase())) {
      erro.classList.remove('d-none');
      messageError.innerHTML = 'com um email válido!';
      return false;
    } else {
      inputEmail.classList.remove('is-invalid');
      inputEmail.classList.add('is-valid');
    }
  }
  return true;
}

function validateCPF() {
  let cpfOnlyNumbers = cpf.value.replace(/\D/g, '');

  if (cpfOnlyNumbers.length !== 11) {
    erro.classList.remove('d-none');
    messageError.innerHTML = 'com o número do cpf';
    cpf.focus();
    cpf.classList.add('is-invalid');
    return false;
  } else {
    let numeros = cpfOnlyNumbers.substring(0, 9);
    let digitos = cpfOnlyNumbers.substring(9);
    let soma = 0;
    for (let i = 10; i > 1; i--) {
      soma += numeros.charAt(10 - i) * i;
    }
    let resultado = soma % 11 < 2 ? 0 : 11 - (soma % 11);

    //Validação do primeiro dígito
    if (resultado != digitos.charAt(0)) {
      erro.classList.remove('d-none');
      messageError.innerHTML = 'com um número de cpf válido';
      return false;
    }

    soma = 0;
    numeros = cpfOnlyNumbers.substring(0, 10);
    for (let k = 11; k > 1; k--) {
      soma += numeros.charAt(11 - k) * k;
    }
    resultado = soma % 11 < 2 ? 0 : 11 - (soma % 11);

    // Validação do segundo dígito
    if (resultado != digitos.charAt(1)) {
      erro.classList.remove('d-none');
      messageError.innerHTML = 'com um número de cpf válido';
      return false;
    }
    if (cpfOnlyNumbers.toString().match(/^(\d)\1*$/)) {
      erro.classList.remove('d-none');
      messageError.innerHTML = 'com um número de cpf válido';
      return false;
    }
    cpf.classList.remove('is-invalid');
    cpf.classList.add('is-valid');
  }
  return true;
}

function validateCourse() {
  if (inputCourse.value === '') {
    messageError.innerHTML = 'com o curso';
    erro.classList.remove('d-none');
    inputCourse.focus();
    inputCourse.classList.add('is-invalid');
    return false;
  } else {
    inputCourse.classList.remove('is-invalid');
    inputCourse.classList.add('is-valid');
  }
  return true;
}

function maskCPF() {
  let cpfLength = cpf.value.length;

  if (cpfLength === 3 || cpfLength === 7) {
    cpf.value += '.';
  } else if (cpfLength === 11) {
    cpf.value += '-';
  }
}

function checkEvenCPF() {
  let returnFunction = true;

  document.querySelectorAll('.cpf-number').forEach(item => {
    if (item.textContent === cpf.value) {
      erro.classList.remove('d-none');
      cpf.classList.add('is-invalid');
      messageError.innerHTML = 'com o outro cpf, cpf já cadastrado!';
      cpf.focus();
      returnFunction = false;
    }
  });
  return returnFunction;
}

function registerStudent() {
  let studentName = inputName.value;
  let studentEmail = inputEmail.value;
  let studentCPF = cpf.value;
  let studentCourse = inputCourse.value;
  let tableBody = document.querySelector('.table-body');
  let tr = document.createElement('tr');

  tr.innerHTML = `
      <td>${studentName}</td>
      <td>${studentEmail}</td>
      <td class="cpf-number">${studentCPF}</td>
      <td>${studentCourse}</td>
      <td id="delete" onclick="removeStudent(this)"><div><img src="assets/images/icon-delete.svg" alt="Icon delete"></div></td>
    `;

  tableBody.appendChild(tr);

  messageSuccess.classList.remove('d-none');

  saveOnLocalStorage();
}

function clearFields() {
  inputName.value = '';
  inputEmail.value = '';
  cpf.value = '';
  inputCourse.value = '';
  inputName.classList.remove('is-valid');
  inputEmail.classList.remove('is-valid');
  cpf.classList.remove('is-valid');
  inputCourse.classList.remove('is-valid');
}

function removeStudent(event) {
  let messageSuccess = document.getElementById('success-register');
  let confirmacao = confirm('Deseja realmente excluir?');
  if (confirmacao) {
    event.parentNode.remove();
    messageSuccess.classList.remove('d-none');
  }
  setTimeout(() => {
    messageSuccess.classList.add('d-none');
  }, 4000);
}

function saveOnLocalStorage() {
  let listaAluno = JSON.parse(localStorage.getItem('listaAluno') || '[]');

  listaAluno.push({
    name: inputName.value,
    email: inputEmail.value,
    cpf: cpf.value,
    course: inputCourse.value
  });

  localStorage.setItem('listaAluno', JSON.stringify(listaAluno));
}
