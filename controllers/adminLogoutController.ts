import type { Request, Response } from 'express'
import fsPromises from 'fs/promises'
import administrators from '../model/administrators.json'
import path from 'path'

const adminDB = {
  admins: administrators,
  setAdmins: function (data: any) {
    this.admins = data
  }
}

const handleAdminLogout = async (req: Request, res: Response) => {
  // NOTE: FED needs to delete the accessToken in clientside memory

  // define cookies and grab it if it exists
  const cookies = req?.cookies
  console.log(`cookie available at login: ${JSON.stringify(cookies)}`)

  // check that there are no cookies or (optionally chaining) for a jwt property and send status 204 if true: 'no content to send for this request'
  if (!cookies.jwt) return res.sendStatus(204)

  // define the refreshToken and set it equal to value received
  const refreshToken = cookies.jwt

  // check if admin exists in the database via refreshToken
  const foundAdmin = adminDB.admins.find(admin => admin.refreshToken === refreshToken)

  // if no foundAdmin proceed with clearing the cookie
  if (!foundAdmin) {
    // NOTE: options for clearing the cookie must be the same as those used during set
    res.clearCookie('jwt', { httpOnly: true, sameSite: 'none', secure: true })

    // return and send status 204 successful but 'no content to send for this request'
    return res.sendStatus(204)
  }

  // The same refreshToken was found in the db, so proceed with deletion.

  const newRefreshTokenArray = foundAdmin.refreshToken.filter(admin => admin !== refreshToken)

  // create currentAdmin object with the foundAdmin and refreshToken set to ''
  const loggedOutAdmin = {
    ...foundAdmin,
    refreshToken: newRefreshTokenArray
  }
  console.log('loggedOutAdmin', loggedOutAdmin)

  // create an array of the other admins in the database that are not the hacked admin
  const otherAdmin = adminDB.admins.filter(admin => admin.id !== foundAdmin.id)

  // check the number of admins in the database
  if (adminDB.admins.length <= 1) {
    // pass in the logged out admin as the sole admin to setAdmins
    adminDB.setAdmins(loggedOutAdmin)
  } else {
    // pass in the other admins along with the logged out admin to setAdmins
    const allAdmin = [...otherAdmin, loggedOutAdmin]
    adminDB.setAdmins(allAdmin)
  }

  // delete cookie
  res.clearCookie('jwt', { httpOnly: true, sameSite: 'none', secure: true })

  // accesstoken is sent as json, that the FED can use to authenticate the admin. FED needs to store this in memory (react context).
  res.json(foundAdmin)

  // return and send status 204 successful but 'no content to send for this request'
  res.sendStatus(204)

  // write the current user to the database
  await fsPromises.writeFile(
    // navigate from the current directory up and into the model directory, to administrators.json
    path.join(__dirname, '..', 'model', 'administrators.json'),

    // specify the data to be written
    JSON.stringify(adminDB.admins)
  )
}

export default handleAdminLogout
