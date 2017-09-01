namespace java gen.service

struct User {
  1: i64 uid,
  2: string username,
  3: string info
}

service Nodis {
  /*void index(1: User user) throws (1: NodisException nodisException) -- can not catch exception <= thrift version 0.8*/
  string index(1: User user)
  string remove(1: string username)
}