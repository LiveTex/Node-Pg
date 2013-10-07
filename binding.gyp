{
  "targets": [
    {
      "target_name": "pg",
      "sources": ["src/connection.cc",
                  "src/pg.cc",
                  "src/pool.cc",
                  "src/query.cc",
                  "src/task.cc",
                  "src/utils.cc"
      ],
      "include_dirs": [
        "/usr/include/postgresql",
        "/usrl/include/jemalloc"
      ],
      "libraries" :[
        "-lpq",
        "-ljemalloc"
      ]
    }
  ]
}
