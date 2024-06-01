export const getEmployeesReportSql = `
SELECT
  e.id,
  e.name,
  e.managerId,
  manager.name AS managerName,
  ci.phone AS phone,
  ci.email AS email,
  COUNT(DISTINCT t.id) AS numberOfTasks,
  COUNT(DISTINCT m.id) AS numberOfMeetings
FROM employees e
  LEFT JOIN employees manager ON e.managerId = manager.id
  LEFT JOIN contacts ci ON e.id = ci.id
  LEFT JOIN tasks t ON e.id = t.assigneeId
  LEFT JOIN meetings_attendees_employees ma ON e.id = ma.employeesId
  LEFT JOIN meetings m ON ma.meetingsId = m.id
GROUP BY e.id, e.name, e.managerId, manager.name, ci.phone, ci.email;
`
