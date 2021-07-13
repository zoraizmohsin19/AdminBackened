var AES = require("crypto-js/aes");
var CryptoJS = require("crypto-js");

var secret_key =    "anf123k5md78kr39ktnf94jthrJJHJ89";


var input   =   [
    {
        'name':'Mukesh',
        'password':'DhP395m8*',
    },
    {
        'name':'Senthil',
        'password':JSON.stringify([{ "u_nm": "Senthil","u_vps": "SYS_USER@123", "u_tok_vl": "12345" }]),
    },
    {
        'name':'Susanta Patro',
        'password':JSON.stringify([{ "u_nm": "Susanta_Patro","u_vps": "SYS_USER@123", "u_tok_vl": "12345" }]),
    },
    {
        'name':'S Rajasekar',
        'password':JSON.stringify([{ "u_nm": "S_Rajasekar","u_vps": "SYS_USER@123", "u_tok_vl": "12345" }]),
    },
    {
        'name':'Ritupobon Baruah',
        'password':JSON.stringify([{ "u_nm": "Ritupobon_Baruah","u_vps": "SYS_USER@123", "u_tok_vl": "12345" }]),
    },
    {
        'name':'Gayathri s',
        'password':JSON.stringify([{ "u_nm": "Gayathri_s","u_vps": "SYS_USER@123", "u_tok_vl": "12345" }]),
    },
    {
        'name':'input',
        'password':JSON.stringify([{ "u_nm": "TEST2","u_vps": "SYS_USER@123", "u_tok_vl": "12345" }])
    }
]
console.log("Secret Key: "+secret_key);

input.forEach((item)=>{
    var plain_text  =   item.password;

    var ciphertext = AES.encrypt(plain_text, secret_key,{
        keySize:128/8,
        iv:plain_text,
        mode:CryptoJS.mode.CBC,
        padding:CryptoJS.pad.ZeroPadding
    });
    
    console.log("Name: "+item.name);
    console.log("Password: "+plain_text);
    console.log("Password Cipher Text: "+ciphertext.toString());

    var bytes  = AES.decrypt(ciphertext.toString(), secret_key);
var plaintext = bytes.toString(CryptoJS.enc.Utf8);

console.log("Decrypted Text: "+plaintext);
    console.log("=====================================================");
})


