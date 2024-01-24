## README

After cloning the repo, just run `./setup.sh` to create and seed the database and make the app available on port 3000. After you're done with the app, run `./teardown.sh` to get rid of the database that was created.

### Design decisions

To allow for reminders more than ~25 days in the future, which is the maximum delay permitted in `setTimeout`, the frontend creates a repeating process that checks which reminders are within 25 days and creates timers for them.

If I had more time, I would Dockerize it and add some tests.
