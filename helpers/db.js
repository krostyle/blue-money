const fs = require('fs');
const saveFile = ((data, pathFile) => {
    fs.writeFileSync(pathFile, (data));
})



module.exports = {
    saveFile
}