// import { serialize } from 'cookie'
import { fbAdminInstance } from '../../firebase/firebase-admin';

import { NextApiRequest, NextApiResponse } from 'next'




const validate = async (token) => {
  // Check that the user has a valid token
  const decodedToken = await fbAdminInstance.auth.verifyIdToken(token, true);

  // let userData;
  // Get user Firebase data from token
  const user = await fbAdminInstance.auth.getUser(decodedToken.uid);
  // Get any additional user data from the Firebase DB
  // await fbAdminInstance
  //   .firestore()
  //   .collection('users')
  //   .doc(decodedToken.uid)
  //   .get()
  //   .then((doc) => {
  //     if (doc.exists) {
  //       userData = { ...doc.data() };
  //     }
  //   })
  //   .catch((error) => {
  //     console.log('Error getting document:', error);
  //   });
  // Assign the user result that will be passed to your _app.js file with populated data from the getUser and db functions
  // const result = {
  //   user: {
  //     uid: user.uid,
  //     email: user.email,
  //     username: userData.username,
  //     emailVerified: user.emailVerified,
  //   },
  // };
  return user;
};

export default async (req: NextApiRequest, res: NextApiResponse) => {

  try {

    const user = await validate(req.body.firebaseAuthToken);

    return res.status(200).send(user);
  } catch (err) {
    console.log(err);
    const result = undefined;
    return res.status(200).send(result);
  }
};


// export default async (req: NextApiRequest, res: NextApiResponse) => {
//   debugger

//   try {

//     if (!req.body.firebaseAuthToken) {
//       debugger
//       res.redirect(307, 'http://localhost:3000/auth')
//       return
//     }


//     const user = await validate(req.body.firebaseAuthToken);

//     return res.status(200).send(user);
//     debugger
//   } catch (err) {
//     debugger

//     console.log(err);
//     const result = undefined;
//     return res.status(200).send(result);
//   }
// };