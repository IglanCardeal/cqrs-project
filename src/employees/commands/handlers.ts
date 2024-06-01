import { AssignManagerHandler } from './assign-manager'
import { CreateEmployeeHandler } from './create-employee'
import { UpdateEmployeeHandler } from './update-employee'

export const commandsHandlers = [
  CreateEmployeeHandler,
  UpdateEmployeeHandler,
  AssignManagerHandler,
]
