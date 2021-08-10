const inquirer = require('inquirer');
const https = require('https');
const path = require('path');
const { saveFile } = require('./helpers/db');


const menu = async() => {
    https.get('https://mindicador.cl/api', (res) => {
        let data = '';
        res.on('data', (chunk) => {
            data += chunk;
        });
        res.on('end', async() => {
            data = (JSON.parse(data));
            const choicesTemp = [];
            Object.keys(data).forEach((key) => {
                choicesTemp.push({
                    value: key,
                    name: `${data[key].nombre}`
                })
            })
            choices = choicesTemp.filter(choice => choice.name !== 'undefined');

            const questions = [{
                    type: 'input',
                    name: 'file_name',
                    message: 'Indique el nombre del archivo que se creará'
                },
                {
                    type: 'input',
                    name: 'ext_name',
                    message: 'Indique la extensión del archivo que creará'
                },
                {
                    type: 'list',
                    name: 'type',
                    message: 'Seleccione conversión',
                    choices
                },
                {
                    type: 'input',
                    name: 'value',
                    message: 'Ingrese valor a convertir'
                }
            ];

            const resp = await inquirer.prompt(questions);
            let valorConversion = 1;
            console.log(resp);
            Object.keys(data).forEach((key) => {
                if (key === resp.type) {
                    valorConversion = data[key].valor
                }
            });
            const fecha_actual = new Date().toISOString();
            const conversionFinal = resp.value / valorConversion;
            const objetoCompleto = `A la fecha : ${fecha_actual}
            Fue realizada contización con los siguientes datos:
            cantidad de pesos a convertir :${resp.value}
            convertido a ${resp.type} da un total de:
            ${conversionFinal}`

            const path = `./db/${resp.file_name}.${resp.ext_name}`;
            saveFile(objetoCompleto, path);

        });
    }).on('error', (e) => {
        console.log(e);
    });
}




menu();