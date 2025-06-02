import conf from '../conf/conf.js'
import { Client, Account, ID } from "appwrite";

export class AuthService{
    client = new Client();
    account;

    constructor(){
        this.client
            .setEndpoint(conf.appwriteUrl)
            .setProject(conf.appwriteProjectId);
        this.account = new Account(this.client);
    }

    async createAccount({email,password,name}){
        try {
          const userAccount = await this.account.create(ID.unique(),email,
            password,name);
            if (userAccount) {
                //call another method
                return this.login({email,password});
            }else{
                return userAccount;
            }
        } catch (error) {
            throw error;
        }
    }

    async login({email,password}){
        try {
          const session = await this.account.createEmailPasswordSession(email,password);
          // after session is created, mint a JWT and attach it to client
          const jwtRes = await this.account.createJWT();
          this.client.setJWT(jwtRes.jwt);
          return session;
        } catch (error) {
            throw error;
        }
    }

    async getCurrentUser() {
        try {
            return await this.account.get();
        } catch (err) {
            console.error("Appwrite service :: getCurrentUser :: error", err);
            // if user is not signed in (guest missing scope), just treat as no user
            if (err.code === 401 || /missing scope/i.test(err.message)) {
                return null;
            }
            throw err;
        }
    }

    async logout(){
        try {
           await this.account.deleteSessions(); 
        } catch (error) {
           console.log("Appwrite service :: logout :: error",error); 
        }
    }
}

const authService = new AuthService();

export default authService

