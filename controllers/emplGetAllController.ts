import type { Request, Response } from 'express'
import employees from '../model/employees.json'
import { Empl } from './../model/employees'

const emplDB = {
  empls: employees,
  setEmpls: function (data: Empl[]) {
    this.empls = data
  }
}

const handleGetAllEmpl = (_req: Request, res: Response) => {
  try {
    // respond with all empls
    res.json(emplDB.empls)
  } catch (err) {
    // send status 500: 'server has encountered a situation it does not know how to handle'
    res.status(500).json({ message: err })
  }
}

export default handleGetAllEmpl
