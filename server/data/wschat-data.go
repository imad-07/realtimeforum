package data

import "database/sql"

type WschatData struct {
	DB *sql.DB
}
 func (*WschatData) Insertmessage(message string) error{
return nil
 }
 func (*WschatData) Getconv(message string) error{
	return nil
 }