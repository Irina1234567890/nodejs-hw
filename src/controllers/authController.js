// import bcrypt from "bcrypt";
// import createHttpError from "http-errors";

// import { User } from "../models/user.js";
// import { createSession, setSessionCookies } from "../services/auth.js";
// import { Session } from "../models/session.js";
// import jwt from "jsonwebtoken";
// import handlebars from 'handlebars';
// import fs from "node:fs/promises";
// import path from "node:path";
// import { sendEmail } from "../utils/sendMail.js";

// // const resetToken =jwt.sign(
// //   {sub: user._id, email}, process.env.JWT_SECRET, {expiresIn: '15m'},

// // );
// // const frontendUrl = `my-frontend.com/reset-password?token=${resetToken}`;
// // console.log(frontendUrl);

// export const registerUser = async (req, res, next) => {

// 	if (!req.body?.email || !req.body?.password) {
// 		return next(createHttpError(400, 'Email and password required'));
// 	}
// 	const { email, password } = req.body;

// 	const existingUser = await User.findOne({ email });

// 	if (existingUser) {
// 		return next(createHttpError(400, 'Email in use'));
// 	}

// 	const hashedPassword = await bcrypt.hash(password, 10);

// 	const newUser = await User.create({
// 		username: email,
// 		email,
// 		password: hashedPassword
// 	});

// 	const newSession = await createSession(newUser._id);
// 	setSessionCookies(res, newSession);

// 	res.status(201).json(newUser);
// };


// export const loginUser = async (req, res, next) => {
// 	if (!req.body?.email || !req.body?.password) {
// 		return next(createHttpError(400, 'Email and password required'));
// 	}

// 	const { email, password } = req.body;

// 	const user = await User.findOne({ email });

// 	if (!user) {
// 		return next(createHttpError(401, 'User not found'));
// 	}

// 	const isValidPassword = await bcrypt.compare(password, user.password);

// 	if (!isValidPassword) {
// 		return next(createHttpError(401, 'Invalid password'));
// 	}

// 	await Session.deleteOne({ userId: user._id });

// 	const newSession = await createSession(user._id);
// 	setSessionCookies(res, newSession);

// 	res.status(200).json(user);
// };

// export const logoutUser = async (req, res) => {
// 	const { sessionId } = req.cookies;

// 	if (sessionId) {
// 		await Session.deleteOne({ _id: sessionId });
// 	}

// 	res.clearCookie('sessionId');
// 	res.clearCookie('accessToken');
// 	res.clearCookie('refreshToken');

// 	res.status(204).send();
// };

// export const refreshUserSession = async (req, res, next) => {

// 	if (!req.cookies?.sessionId || !req.cookies?.refreshToken) {
// 		return next(createHttpError(400, 'Missing authentication cookies'));
// 	}

// 	const { sessionId, refreshToken } = req.cookies;

// 	const session = await Session.findOne({
// 		_id: sessionId,
// 		refreshToken
// 	});

// 	if (!session) {
// 		return next(createHttpError(401, 'Session not found'));
// 	}

// 	const isSessionExpired = new Date() > new Date(session.refreshTokenValidUntil);

// 	if (isSessionExpired) {
// 		return next(createHttpError(401, 'Token expired'));
// 	}

// 	await Session.deleteOne({
// 		_id: sessionId,
// 		refreshToken
// 	});

// 	const newSession = await createSession(session.userId);
// 	setSessionCookies(res, newSession);

// 	res.status(200).json({ message: 'Session refreshed', });
// };
// export const requestResetEmail = async (req, res, next) => {
//   const { email } = req.body;
//   const user = await User.findOne({ email });

//   if (!user) {
//     // Для безпеки повертаємо 200, навіть якщо юзера немає
//     return res.status(200).json({ message: 'Password reset email sent successfully' });
//   }

//   const resetToken = jwt.sign(
//     { sub: user._id, email },
//     process.env.JWT_SECRET,
//     { expiresIn: '15m' }
//   );

//   try {
//     const templatePath = path.resolve('src/templates/reset-password-email.html');
//     const templateSource = await fs.readFile(templatePath, 'utf-8');
//     const template = handlebars.compile(templateSource);
//     const html = template({
//       name: user.username,
//       link: `${process.env.FRONTEND_DOMAIN}/reset-password?token=${resetToken}`,
//     });

//     await sendEmail({
//       to: email,
//       subject: 'Reset your password',
//       html,
//     });

//     res.status(200).json({ message: 'Password reset email sent successfully' });
//   } catch (err) {
//     next(createHttpError(500, 'Failed to send the email, please try again later.'));
//   }
// };

// export const resetPassword = async (req, res, next) => {
//   const { token, password } = req.body;

//   try {
//     let payload;
//     try {
//       payload = jwt.verify(token, process.env.JWT_SECRET);
//     } catch {
//       return next(createHttpError(401, 'Invalid or expired token'));
//     }

//     const user = await User.findOne({ _id: payload.sub, email: payload.email });
//     if (!user) return next(createHttpError(404, 'User not found'));

//     const hashedPassword = await bcrypt.hash(password, 10);
//     await User.findByIdAndUpdate(user._id, { password: hashedPassword });

//     res.status(200).json({ message: 'Password reset successfully' });
//   } catch (error) {
//     next(error);
//   }
// };
//
//
import bcrypt from "bcrypt";
import createHttpError from "http-errors";
import jwt from "jsonwebtoken";
import handlebars from 'handlebars';
import fs from "node:fs/promises";
import path from "node:path";

import { User } from "../models/user.js";
import { Session } from "../models/session.js";
import { createSession, setSessionCookies } from "../services/auth.js";
import { sendEmail } from "../utils/sendMail.js"; // Виправлено: додано імпорт

export const registerUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return next(createHttpError(400, 'Email in use'));
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      username: email,
      email,
      password: hashedPassword
    });

    const newSession = await createSession(newUser._id);
    setSessionCookies(res, newSession);

    res.status(201).json(newUser);
  } catch (error) {
    next(error);
  }
};

export const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return next(createHttpError(401, 'Invalid credentials'));
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return next(createHttpError(401, 'Invalid credentials'));
    }

    await Session.deleteOne({ userId: user._id });

    const newSession = await createSession(user._id);
    setSessionCookies(res, newSession);

    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};

export const logoutUser = async (req, res, next) => {
  try {
    const { sessionId } = req.cookies;

    if (sessionId) {
      await Session.deleteOne({ _id: sessionId });
    }

    res.clearCookie('sessionId');
    res.clearCookie('accessToken');
    res.clearCookie('refreshToken');

    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

export const refreshUserSession = async (req, res, next) => {
  try {
    const { sessionId, refreshToken } = req.cookies;

    const session = await Session.findOne({ _id: sessionId, refreshToken });
    if (!session) {
      return next(createHttpError(401, 'Session not found'));
    }

    const isSessionExpired = new Date() > new Date(session.refreshTokenValidUntil);
    if (isSessionExpired) {
      return next(createHttpError(401, 'Session token expired'));
    }

    await Session.deleteOne({ _id: sessionId });

    const newSession = await createSession(session.userId);
    setSessionCookies(res, newSession);

    res.status(200).json({ message: 'Session refreshed' });
  } catch (error) {
    next(error);
  }
};

export const requestResetEmail = async (req, res, next) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(200).json({ message: 'Password reset email sent successfully' });
    }

    const resetToken = jwt.sign(
      { sub: user._id, email },
      process.env.JWT_SECRET,
      { expiresIn: '15m' }
    );

    const templatePath = path.resolve('src/templates/reset-password-email.html');
    const templateSource = await fs.readFile(templatePath, 'utf-8');
    const template = handlebars.compile(templateSource);

    const html = template({
      name: user.username,
      link: `${process.env.FRONTEND_DOMAIN}/reset-password?token=${resetToken}`,
    });

    await sendEmail({
      to: email,
      subject: 'Reset your password',
      html,
    });

    res.status(200).json({ message: 'Password reset email sent successfully' });
  } catch (err) {
    // err використовується для логування, щоб не було помилки "unused variable"
    console.error("Email sending error:", err);
    next(createHttpError(500, 'Failed to send the email, please try again later.'));
  }
};

export const resetPassword = async (req, res, next) => {
  const { token, password } = req.body;

  try {
    let payload;
    try {
      payload = jwt.verify(token, process.env.JWT_SECRET);
    } catch  {
      return next(createHttpError(401, 'Invalid or expired token'));
    }

    const user = await User.findOne({ _id: payload.sub, email: payload.email });
    if (!user) {
      return next(createHttpError(404, 'User not found'));
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await User.findByIdAndUpdate(user._id, { password: hashedPassword });

    res.status(200).json({ message: 'Password reset successfully' });
  } catch (error) {
    next(error);
  }
};
