import { User, Username } from "./User";
import { Project } from "./project";
import { Feature } from "./feature";
import { Task } from "./Task";
import file from "../assets/application_key.json";
import { encode, decode } from "base-64";




export class CryptoUtilObject {

    /**
     * Instance of the symmetric key used for trivial, basic encryption/decryption of non-sensitive user data
     * @property {@linkcode CryptoUtilObject}
     * @see | {@linkcode CryptoUtilObject.getPublicKeyFromFile}  |
     */
    private static _applicationKey = CryptoUtilObject.getPublicKeyFromFile();
    private static init = false;
    /**
     * A read only instance of the symmetric key used for trivial, basic encryption/decryption of non-sensitive user data
     * @property {@linkcode CryptoUtilObject}
     * @see | {@linkcode CryptoUtilObject.getPublicKeyFromFile}  |
     */
    public static get applicationKey() {
        if (!CryptoUtilObject.init) {

            CryptoUtilObject._applicationKey = CryptoUtilObject.getPublicKeyFromFile();

            CryptoUtilObject.init = true;

            return CryptoUtilObject._applicationKey;
        }
        else {

            return CryptoUtilObject._applicationKey;
        }


    }






    /**
     * Gets the application public key used for public encryption from the persistent storage, included with any legitimate version of the application
     *  -> Used to encrypt and decrypt the username list in /username
     * @throws {Error} - Error on failure of I/O-operations (reading from the persistence layer ) 
     * @returns {KeyObject} - A encrypt/decrypt-key using AES-GCM(256) 
     * 
     */
    private static async getPublicKeyFromFile() {

        const txtEncoder: TextEncoder = new TextEncoder();





        const fileBuffer = txtEncoder.encode(file.value).slice(0, 32)
        const applicationPubKey: CryptoKey = await crypto.subtle.importKey(`raw`, fileBuffer, {
            //AES-GCM : Advanced Encryption Standard using Galois Counter Mode - Provides a) Authentication, b) Integrity, Security -functionality. Used for encryption/decryption of trivial security data I.E The username list in /username
            name: "AES-GCM",
            length: 256
        }, true, ["encrypt", "decrypt"]);




        return Promise.resolve(applicationPubKey);



    }

    /**
    * Takes a string in base 64 and returns a decoded string
    * 
    * @param base64String 
    */
    static decodeBase64(base64String: string): string {
        return decode(base64String);

    }
    /**
     * Takes a string to be encoded into base 64 and returns a 
     * base 64-encoded string
     * 
     * @param stringToBeBase64 
     */
    static encodeBase64(stringToBeBase64: string): string {
        return encode(stringToBeBase64);


    }
    /**Generates a secure password key that can be in session-storage ( ; Not exposing the password), when this is used, make sure
   * to force garbage collection of the original password string. 
   * 
   * - Can be used with await for synchronous handling
   * - Is a wrapping/unwrapping key for the actual decryption key used for encryption/decryption stored in /user[username-index]
   * 
   * @param {string} username - The user´s input username 
   * @param {string} password - The user´s input password on login/sign-up
   * @param {(crypt.BinaryLike | null)} saltBytes - The salt used in the last encryption, provided in the user-table. If left as null a random, high entropic salt array will be generated  
   * @returns {  Promise<[CryptoKey,  Uint8Array<ArrayBuffer]> } - The secret key of the user, used to unwrap/ wrap the actual encryption/decryption AES-GCM key
   * @throws {Error} - Error on failure of encryption
   * 
   * @see | {@linkcode User.password} | {@linkcode Promise} | {@linkcode CryptoKey} |
   */
    static async createUserWrapUnwrapKey(username: string, password: string, saltBytes: (Uint8Array<ArrayBuffer> | null)): Promise<[CryptoKey, Uint8Array<ArrayBuffer>]> {

        const txtEncoder: TextEncoder = new TextEncoder();

        // We want a 256-byte long key material to be used for creating the key - As such we use the internal transformation (~ hashing)-functions to generate two 128-byte arrays

        let usernameByteArray = txtEncoder.encode(username);
        let passwordByteArray = txtEncoder.encode(password);

       

        //Set method-internal variables of username and password to null to minimize exposure time in stack memory in this part of the hierarchy



        let transformedUsernameBytes = await transformUsername(usernameByteArray, passwordByteArray);
        let transformedPasswordBytes = await transformPassword(passwordByteArray, usernameByteArray);
        //Set method-internal variables of username and password-bytearrays to null to minimize exposure time in stack memory in this part of the hierarchy


        //Combine transformedByteArrays into a 256 array
        let combinedUsernamePasswordByteArray = new Uint8Array(32);

        combinedUsernamePasswordByteArray.set(transformedUsernameBytes);

        combinedUsernamePasswordByteArray.set(transformedPasswordBytes, transformedUsernameBytes.length);
        //Set method-internal variables of username and password-bytearrays to null to minimize exposure time in stack memory in this part of the hierarchy
        const Int8Array = new Uint8Array(32);



        //saltBytes not included - Either on sign-up or on sign out, when a new salt is generated as to never reuse the salt and preserving the integrity of the key 
        if (!saltBytes) {
            saltBytes = window.crypto.getRandomValues(Int8Array);


        }


        //Generate key from the combined array

        let importedBaseDerivationKey = await window.crypto.subtle.importKey("raw", combinedUsernamePasswordByteArray, { name: "pbkdf2" }, false, ["deriveKey"]).catch((error) => { throw new Error(error) });

        const userWrappingUnwrappingKey = await window.crypto.subtle.deriveKey({ name: "pbkdf2", hash: "SHA-512", iterations: 100000, salt: saltBytes }, importedBaseDerivationKey, { name: "AES-GCM", length: 256 }, true, ["wrapKey", "unwrapKey"]).catch((error) => { throw new Error(error) });








        return [userWrappingUnwrappingKey, saltBytes];

         /**
     * Transforms the given byte array into a uniquely generated set of bytes with the length of (usernameAsBytes.length + extraBytesWanted)
     * @param { Uint8Array<ArrayBuffer>} usernameAsBytes - The username encoded as a uint8bitarray
     * @param { Uint8Array<ArrayBuffer>} passwordAsBytes - The password encoded as a uint8bitarray
     * @param {number} extraBytesWanted - The number of bytes you want to add to the username length
     * @returns { Uint8Array<ArrayBuffer>} - The transformed username as a byte array
     */
     async function transformUsername(usernameAsBytes: Uint8Array<ArrayBufferLike>, passwordAsBytes: Uint8Array<ArrayBufferLike>): Promise<Uint8Array<ArrayBuffer>> {
        //Gets a byte-array capable of holding all of the bytes neede4d
        //let usernameTransformed = new  Uint8Array(usernameAsBytes.length + extraBytesWanted);
        //let nthByte: number = 0;


        //import a the user name as CryptoKey

        const importedUsernameBytes = await window.crypto.subtle.importKey("raw", usernameAsBytes,{ name: "PBKDF2" }, false, ["deriveBits"]).catch((error) => { throw new Error(error) });

        let usernameTransformed = await window.crypto.subtle.deriveBits({ name: "pbkdf2", hash: "SHA-512", iterations: 100000, salt: passwordAsBytes }, importedUsernameBytes, 16).catch((error) => { throw new Error(error) });




        return new Uint8Array(usernameTransformed);
    }
    /**
     * Transforms the given byte array into a uniquely generated  set of bytes with the length of (passwordAsBytes.length + extraBytesWanted)
     * 
     * 
     * @param { Uint8Array<ArrayBuffer>} passwordAsBytes - The password encoded as a uint8bitarray
     * @param { Uint8Array<ArrayBuffer>} usernameAsBytes - The username encoded as a uint8bitarray
     * @param {number} extraBytesWanted - The number of bytes you want to add to the passwordByteArray length length
     * @returns { Uint8Array<ArrayBuffer>} - The transformed password as a byte array
     */
     async function transformPassword(passwordAsBytes: Uint8Array<ArrayBufferLike>, usernameAsBytes: Uint8Array<ArrayBufferLike>): Promise<Uint8Array<ArrayBuffer>> {


        const importedPasswordAsBytes = await window.crypto.subtle.importKey("raw", passwordAsBytes, { name: "PBKDF2" }, false, ["deriveBits"]).catch((error) => { throw new Error(error) });

        let passwordAsBytesTransformed = await window.crypto.subtle.deriveBits({ name: "pbkdf2", hash: "SHA-512", iterations: 120000, salt: usernameAsBytes }, importedPasswordAsBytes, 16).catch((error) => { throw new Error(error) });

        return new Uint8Array(passwordAsBytesTransformed);

    }


    }


   

    /**
     * Generates a wrapped encryption key to encrypt/decrypt the sensitive user-object 
     * 
     * - A new aes-gcm key can be generated at every sign-out and be used to encrypt the latest version of the User-object 
     * 
     * 
     * 
     * 
     * @param {CryptoKey|null} userWrappingKey - The user specific secret key instantiated in {@linkcode CryptoUtilObject.createUserWrapUnwrapKey}, used to wrap the AES-GCM-key to enforce user-specific access to user encryption/decryption key 
     * @returns {[Uint8Array<ArrayBuffer>, Uint8Array<ArrayBuffer>]} - The wrapped key and initilization vector used in the wrap cipher
     */
    static async generateAESGCMUserSecretKey(userWrappingKey: CryptoKey) {

        let unwrappedKey = await window.crypto.subtle.generateKey(
            {
                name: "AES-GCM",
                length: 256,
            },
            true,
            ["encrypt", "decrypt"],
        );
        //Generate IV - 16 Bytes is recommended no matter block size

        const iv = window.crypto.getRandomValues(new Uint8Array(16));
        // Get application public key as additional data as any instance not having this instance should not be allowed to wrap/unwrap any user key

        let applicationCryptoKey = await CryptoUtilObject.applicationKey;


        const applicationKeyJwk = await crypto.subtle.exportKey("jwk", applicationCryptoKey);

        const wrappedKey = await crypto.subtle.wrapKey("jwk", unwrappedKey, userWrappingKey, {
            name: "AES-GCM",
            length: 256,
            iv: iv,
            //We use the application-key as additional data, further forcing authentication of browsing user
            additionalData: new TextEncoder().encode(applicationKeyJwk.k)

        });

        const uint8Array = new Uint8Array(wrappedKey);

        return [uint8Array, iv];

    }
    /**
     * Generates a AES-GCM project-encryption  key, to be assigned to projectKey in ProjectKeyObject
     * 
     * @returns {Promise<JsonWebKey>} - The aes-gcm encryption key to use for encryption of project 
     * 
     * @see | {@link ProjectKeyObject.projectKey} |  
     */
    static async generateAESGCMProjectKey(): Promise<JsonWebKey> {

        const aesKey = await window.crypto.subtle.exportKey("jwk", await window.crypto.subtle.generateKey(
            {
                name: "AES-GCM",
                length: 256,
            },
            true,
            ["encrypt", "decrypt"],
        ));
        return aesKey;
    }





    /**
     * Generates a wrapped encryption key to encrypt/decrypt the sensitive user-object 
     * 
     * - Used to wrap private keys
     * 
     * 
     * 
     * @param {CryptoKey} keyToWrap - The key to wrap (Export + encrypt) 
     * @param {KeyObject} userWrappingKey - The user specific secret key instantiated in {@linkcode CryptoUtilObject.createUserWrapUnwrapKey}, used to wrap the AES-GCM-key to enforce user-specific access to user encryption/decryption key 
     * @returns {[Uint8Array<ArrayBuffer>, Uint8Array<ArrayBuffer>]} - The wrapped key and initilization vector used in the wrap cipher
     */
    static async wrapPrivateKey(keyToWrap: CryptoKey, userWrappingKey: CryptoKey): Promise<[Uint8Array<ArrayBuffer>, Uint8Array<ArrayBuffer>]> {

        //Generate IV - 16 Bytes is recommended no matter block size

        const iv = window.crypto.getRandomValues(new Uint8Array(16));
        // Get application public key as additional data as any instance not having this instance should not be allowed to wrap/unwrap any user key

        let applicationCryptoKey = await CryptoUtilObject.applicationKey;

        const applicationKeyJwk = await window.crypto.subtle.exportKey("jwk", applicationCryptoKey);

        const wrappedKey = await crypto.subtle.wrapKey("jwk", keyToWrap, userWrappingKey, {
            name: "AES-GCM",
            length: 256,
            iv: iv,
            //We use the application-key as additional data, further forcing authentication of browsing user
            additionalData: new TextEncoder().encode(applicationKeyJwk.k)

        });
        const uint8Array = new Uint8Array(wrappedKey);

        return [uint8Array, iv];






    }

    /**
     * 
     * Unwraps the given encryption key using the username/password-derived key from {@linkplain CryptoUtilObject.createUserWrapUnwrapKey}
     * 
     * @param { Uint8Array<ArrayBuffer>} wrappedKey - The wrapped aes-gcm key for the specific user used for sensitive data
     * @param {CryptoKey} userWrappingUnwrappingKey - The username/password derived aes-gcm key, used to aqquire the encryption/decryption key for the user-sensitive data
     * @param {Uint8Array<ArrayBuffer>} wrappedCipherIv - The initilization vector used in the wrap-algorithm-object (cipher), in byte-array format (UInt8Array<ArrayBuffer>) 
     * @param {boolean} isRSAKey - Should be true if and only if the key to unwrap is the private RSA-PSS key 
     * @returns {Promise<webcrypto.CryptoKey>} - The unwrapped crypto key, can be used to decrypt the sensitive User-entry in the (/)user-table. Should only be used in temporary variables : Formatted as pkcs8, non-extractable.
     */
    static async unwrapKey(wrappedKey: ArrayBuffer, userWrappingUnwrappingKey: CryptoKey, wrappedCipherIv: Uint8Array<ArrayBuffer>, isRSAKey: boolean) {

        let applicationCryptoKey = await CryptoUtilObject.applicationKey;

        const applicationKeyJwk = await window.crypto.subtle.exportKey("jwk", applicationCryptoKey);


        if (isRSAKey) {
            return await window.crypto.subtle.unwrapKey(
                "jwk",
                wrappedKey,
                userWrappingUnwrappingKey,
                {
                    name: "AES-GCM",
                    length: 256,
                    iv: wrappedCipherIv,
                    //We use the application-key as additional data, further forcing authentication of browsing user
                    additionalData: new TextEncoder().encode(applicationKeyJwk.k)

                },
                { name: "RSA-OAEP", hash: "SHA-512" },
                //Since we don´t change the rsa key this needs to be extractable to be re-wrapped with the new user key on log-out
                true,
                ["decrypt"]).catch((error) => { throw new Error("Username password combination not found!") });

        }
        else if (!isRSAKey) {
            return await window.crypto.subtle.unwrapKey(
                "jwk",
                wrappedKey,
                userWrappingUnwrappingKey,
                {
                    name: "AES-GCM",
                    length: 256,
                    iv: wrappedCipherIv,
                    //We use the application-key as additional data, further forcing authentication of browsing user
                    additionalData: new TextEncoder().encode(applicationKeyJwk.k)

                },
                { name: "AES-GCM", length: 256 },
                false,
                ["encrypt", "decrypt"]).catch((error) => { throw new Error("Username password combination not found!") });
        }
        else {
            throw new Error("Unsupported input : CryptographyUtilObject.unwrapKey")
        }
    }
    /**
     * Creates a public/private  RSA-PSS-keypair where the public key is posted with the user mailbox
     * 
     * - Keypair is stored in User-instance in User.AuthObject, this means that method must only be run on creation or if user-credentials are compromised (: Prompting a selection of new username/password pairing)
     * 
     * @param {KeyObject} userWrappingKey - The user wrap/unwrap key
     * @returns {Promise<[JsonWebKey, [Uint8Array<ArrayBuffer>, Uint8Array<ArrayBuffer>]]>}  [ publicRSA-PSSKey, [wrappedPrivateRSA-PSSKey, wrapCipherIv] ] - The public RSA-key as a Jsonwebkey and a wrapped version of the private key together with the init. vector for the wrap-cipher
     */
    static async createPublicPrivateKeyPairForUserMailbox(userWrappingKey: CryptoKey): Promise<[JsonWebKey, [Uint8Array<ArrayBuffer>, Uint8Array<ArrayBuffer>]]> {

        let keyPair = await window.crypto.subtle.generateKey(
            {
                name: "RSA-OAEP",
                modulusLength: 4096,
                publicExponent: new Uint8Array([1, 0, 1]),
                hash: "SHA-512",
            },
            true,
            ["encrypt", "decrypt"],
        );

        const publicKeyBuffer: JsonWebKey = await window.crypto.subtle.exportKey("jwk", keyPair.publicKey)

        return [publicKeyBuffer, await CryptoUtilObject.wrapPrivateKey(keyPair.privateKey, userWrappingKey)];

    }


    /**
     * Encrypts the data using the string generated from {@linkcode JSON.stringify} and returns the encrypted version of that
     * string
     * 
     * @param {(User| Project | Feature | Task | Username[])} data - The data to be encrypted, reflecting the different entities for the respective tables 
     * @param {CryptoKey} encryptionKey - The encryption key for the cipher, needs to be an unwrapped key, can be null if and only if the data is the Username-array
     * @param {boolean} isRSAKey - Should be true if and only if the key is the public RSA-PSS key (data intended for user Mailbox)
     * @returns {} - [initializationVector, encryptedData] || (if any only if isRsaKey == true) [null, encryptedData] : null since no init-vector needed for public encryption
     * 
     */
    static async encrypt(data: (User | Project | Feature | Task | string), encryptionKey: CryptoKey | null, isRSAKey: boolean): Promise<[(null), Uint8Array<ArrayBuffer>] | [Uint8Array<ArrayBuffer>, Uint8Array<ArrayBuffer>]> {

        if ((data instanceof User || data instanceof Project || data instanceof Feature || data instanceof Task || typeof data === "string") && encryptionKey != null) {

            if (isRSAKey) { //If a User-instance this means that it is to be posted inside the  `/mailbox`-table, and uses the private AES-GCM key generated by the user

                const dataBuffer = (typeof data === "string") ? new TextEncoder().encode(data) : new TextEncoder().encode(JSON.stringify(data));

                const encryptedData = await window.crypto.subtle.encrypt({ name: "RSA-OAEP" }, encryptionKey, dataBuffer);

                const uint8Array = new Uint8Array(encryptedData);


                return [null, uint8Array];
            }
            else {
                //If a User-instance this means that it is to be posted inside the  `/user`-table or the project-table, and uses the private AES-GCM key generated by the user or the projectKey 

                const initVector: Uint8Array<ArrayBuffer> = window.crypto.getRandomValues(new Uint8Array(96));
                const dataBuffer = new TextEncoder().encode(JSON.stringify(data));
                const encryptedData: ArrayBuffer = await crypto.subtle.encrypt(
                    {
                        name: `AES-GCM`,
                        iv: initVector

                    },
                    encryptionKey,
                    dataBuffer

                );
                const uint8Array = new Uint8Array(encryptedData);


                return [initVector, uint8Array];
            }
        }
        //If not any of the above <=> Is Username-array
        else if (typeof data === "string") {

            const dataBuffer = new TextEncoder().encode(data);

            let cryptoKey = await CryptoUtilObject._applicationKey;
            // key.type = "secret";
            // key.symmetricKeySize = 256;

            // const cryptoKey = key.toCryptoKey({
            //     //AES-GCM : Advanced Encryption Standard using Galois Counter Mode - Provides a) Authentication, b) Integrity, Security -functionality. Used for encryption/decryption of trivial security data I.E The username list in /username
            //     name: "AES-GCM",
            //     length: 256
            // },
            //     false,
            //     ["encrypt", "decrypt"]);
            const Int8Array = new Uint8Array(32);
            const initVector: Uint8Array = window.crypto.getRandomValues(Int8Array);


            const encryptedData = await window.crypto.subtle.encrypt(
                {
                    name: `AES-GCM`,
                    iv: initVector

                },
                cryptoKey,
                dataBuffer);

            const uint8Array = new Uint8Array(encryptedData);


            return [initVector, uint8Array];






        }
        else {

            throw Error("Unsupported input : CryptoUtil.encrypt");
        }



    }
    /**
     * Used for tracking updates in  the projectupdate-table
     * 
     * @param data 
     * @returns hashed data
     */
    static async createHash(data: string) {


        const dataBuffer = new TextEncoder().encode(data).buffer;
        const digest = window.crypto.subtle.digest({ name: "SHA-256" }, dataBuffer);
        const hashArray = Array.from(new Uint8Array(await digest));
        const hashHex = hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");

        return hashHex;

    }
    /**
     * Takes an encrypted data ({@linkplain ArrayBuffer}) as input and returns the decrypted string value of that array buffer 
     * 
     * @param encryptedData 
     * @param {CryptoKey | null} decryptionKey - (If applicable, the unwrapped version) : The decryption key for an algorithm/user-pair ( (RSA-PSS || AES-GCM)  + specific User ), will use the application encryption key
     *  if and only if this parameter === null 
     * @param {Uint8Array<ArrayBuffer>} initVector - The IV provided with the call to {@linkplain CryptoUtilObject.encrypt}
     * @param {boolean} isRSAKey - Should be true when decrypting Mailbox-content
     * @returns {Promise<string>} - The decrypted data
     * 
     * @see     | {@linkplain CryptoUtilObject.unwrapKey}, for the use cases pertaining to unwrapped keys}|
     */
    static async decrypt(encryptedData: Uint8Array<ArrayBuffer>, decryptionKey: CryptoKey | null, initVector: Uint8Array<ArrayBuffer> | null, isRSAKey: boolean) {

        let returnString: string = "";

        if (isRSAKey && decryptionKey) { //If a User-instance this means that it is to be posted inside the  `/user`-table, and uses the private AES-GCM key generated by the user



            const decryptedData = await window.crypto.subtle.decrypt({ name: "RSA-OAEP" }, decryptionKey, encryptedData);


            returnString = new TextDecoder().decode(decryptedData);
        }
        else if (isRSAKey === false && decryptionKey) {
            const decryptedData = await crypto.subtle.decrypt(
                {
                    name: `AES-GCM`,
                    iv: initVector

                },
                decryptionKey,
                encryptedData
            );

            returnString = new TextDecoder().decode(decryptedData);


        }
        //If not any of the above <=> Is Username-array <=> ApplicationKey should be used 
        else if (decryptionKey === null) {

            const cryptoKey = await CryptoUtilObject._applicationKey;




            let decryptedData = await window.crypto.subtle.decrypt(
                {
                    name: `AES-GCM`,
                    iv: initVector

                },
                cryptoKey,
                encryptedData);

            returnString = new TextDecoder().decode(decryptedData);

        }

        return returnString;




    }







}

