import CredentialsProvider from "next-auth/providers/credentials";
import { autenticaUsuarioDB } from "@/componentes/bd/usecases/usuarioUseCases";
import { signIn } from "next-auth/react";

export const authOptions = {
    session: {
        strategy: "jwt",
        maxAge: 1800, // tempo em segundos - 30 minutos
    },
    pages : {
        signIn : '/login',
    },
    providers: [
        CredentialsProvider({           
           name : "Credentials",
            credentials: {
                email: {
                    label: "Email",
                    type: "email",
                    placeholder: "example@example.com",
                },
                senha: { label: "Senha", type: "password" },
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials.senha) {                    
                    return null;
                }

                let usuario = null;
                try {
                    usuario = await autenticaUsuarioDB(credentials);
                    console.log('Usuario: ' + JSON.stringify(usuario));
                } catch (err) {
                    return null;
                }

                if (!usuario) {
                    return null;
                }            
                // adicionando o tipo como informação adicional do user da biblioteca                           
                return { tipo : usuario.tipo ?? "user" ,  
                    id : usuario.email,                
                    email: usuario.email,
                    name: usuario.nome,              
                    randomKey: parseInt(Math.random() * 9999)
                };   
                      
            },
        }),
    ],
    callbacks: {
        session: ({ session, token }) => {
          console.log("Session Callback", { session, token }); 
          // adiciono no user da sessão o tipo  
          session.user.tipo = token.tipo;
          return {
            ...session,
            user: {
              ...session.user,
              id: token.id,
              name : session.user.name,
              randomKey: token.randomKey,
            },
          };
        },
        jwt: ({ token, user }) => {
          console.log("JWT Callback", { token, user });          
          if (user) {
            const u = user;  
            token.tipo = user.tipo;          
            return {
              ...token,
              id: u.id,
              randomKey: u.randomKey,
            };
          }
          return token;
        },
      },    
};