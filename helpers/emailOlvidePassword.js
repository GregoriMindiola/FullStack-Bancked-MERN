import nodemailer from 'nodemailer';

const emailOlvidePassword = async(datos) => {
   const {email, nombre, token} = datos;
   
      const transport = nodemailer.createTransport({
          host: process.env.EMAIL_HOST,
          port: process.env.EMAIL_PORT,
          auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASSWORD
          }
        });   
   
      // Enviar email
      const info = await transport.sendMail({
          from: '"APV - Administrador Pacientes Veterinaria" <apv@correo.com>', 
          to: email, 
          subject: "Restablece tu password ✔", 
          text: "Restablece tu password", 
          html: ` <p> Hola <strong>${nombre}</strong> <br /> Comprueba tu cuenta</p>
          <p>Hace falta solo un paso para reestablecer tu password, haz click en el siguiente enlace: 
          <a href='${process.env.FRONTEND_URL}/olvide-password/${token}'>Reestablecer Password</a>
          </p>
          
          <p>Si no creaste esta cuenta, puedes eliminar este mensaje</p>
   
          `, // html body
        });
   
      console.log('Mensaje enviado: %s', info.messageId);
  };

export default emailOlvidePassword