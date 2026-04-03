export interface AuditableBaseModel {
  id: string;
  createdOn: string;//Datetime
  lastModifiedOn: string;//Datetime?
}