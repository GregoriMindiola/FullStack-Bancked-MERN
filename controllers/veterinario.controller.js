import emailOlvidePassword from "../helpers/emailOlvidePassword.js";
import emailRegistro from "../helpers/emailRegistro.js";
import generarJWT from "../helpers/generarJWT.js";
import Veterinario from "../models/Veterinario.js"

const registrar = async (req, res) => {
  const { email, password, nombre } = req.body;

  //prevenir usuarios duplicados
  const existeEmail = await Veterinario.findOne({ email });
  if (existeEmail) {
    const error = new Error("Email se encuentra registrado");
    return res.status(400).json({ msg: error.message });
  }
  try {
    //Guardar usuarios
    const veterinario = new Veterinario(req.body);
    const veterinarioGuardado = await veterinario.save();

    //Enviar el email
    emailRegistro({
      email,
      nombre,
      token: veterinarioGuardado.token
    })
    res.json(veterinarioGuardado);
  } catch (error) {
    console.log(error);
  }
};

const perfil = (req, res) => {
  const { veterinario } = req;
  res.json({ perfil: veterinario });
};

const confirmar = async (req, res) => {
  const { token } = req.params;

  const usuarioConfirmar = await Veterinario.findOne({ token });

  if (!usuarioConfirmar) {
    const error = new Error("Token no valido");
    return res.status(404).json({ msg: error.message });
  }
  try {
    usuarioConfirmar.token = null;
    usuarioConfirmar.confirmado = true;
    await usuarioConfirmar.save();
    res.json({ msg: "Usuario confirmado correctamente" });
  } catch (error) {
    console.log(error);
  }
};

const auth = async (req, res) => {
  const { email, password } = req.body;
  const usuario = await Veterinario.findOne({ email });
  //Comprobar si el usuario existe
  if (!usuario) {
    const error = new Error("Email no existe");
    return res.status(404).json({ msg: error.message });
  }
  //Comporbar si el usuario esta confirmado
  if (!usuario.confirmado) {
    const error = new Error("Usuario no confirmado");
    return res.status(404).json({ msg: error.message });
  }

  //Revisar el password
  if (await usuario.comprobarPassword(password)) {
    // autenticar
    res.json({ token: generarJWT(usuario.id) });
  } else {
    const error = new Error("El password es incorecto");
    return res.status(404).json({ msg: error.message });
  }
};

const olvidePassword = async (req, res) => {
  const { email } = req.body;

  const existeVeterinario = await Veterinario.findOne({ email });

  if (!existeVeterinario) {
    const error = new Error("Email no existe");
    return res.status(404).json({ msg: error.message });
  }
  try {
    existeVeterinario.token = generarJWT();
    await existeVeterinario.save();

    //EnviarEmail con instrucciones 
    emailOlvidePassword({
      email,
      nombre: existeVeterinario.nombre,
      token: existeVeterinario.token
    })

    res.json({ msg: "Hemos enviado un email con las instrucciones" });
  } catch (error) {
    console.log(error);
  }
};

const comprobarToken = async (req, res) => {
  const { token } = req.params;
  const tokenValido = await Veterinario.findOne({ token });

  if (tokenValido) {
    res.json({ msg: "Token válido y el usuario sí existe" });
  } else {
    const error = new Error("Token no válido");
    return res.status(400).json({ msg: error.message });
  }
};

const nuevoPassword = async (req, res) => {

  const { token } = req.params;
  const { password } = req.body;

  const veterinario = await Veterinario.findOne({ token })

  if(!veterinario){
    const error = new Error("Hubo un error")
    return res.status(400).json({ msg: error.message })
  }
  try {
    veterinario.token = null;
    veterinario.password = password;
    await veterinario.save();
    res.json({ msg: "Password modificado correctamente "})
  } catch (error) {
    console.log(error)
  }
};
export {
  registrar,
  perfil,
  confirmar,
  auth,
  olvidePassword,
  comprobarToken,
  nuevoPassword,
};
