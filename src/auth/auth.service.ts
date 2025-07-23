import { Injectable } from "@nestjs/common";

@Injectable({})
export class AuthService{

    signup(){
        return 'I am signed up'
    }

    login(){
        return 'I am signed in'
    }
};