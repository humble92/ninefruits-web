# Ninefruits.work

The portfolio, and the front door to the software.

This site introduces the developer and the apps. Each project page says what the app is for, what it does, and what it is built with. Screenshots sit with that story. A demo plays when one exists.

| App | What it is |
|---|---|
| [Photo Contest](apps/photo-contest.html) | A mobile app for sharing photos with a group and voting on them. |
| [Ninefruits for Laravel](apps/ninefruits-laravel.html) | A student information system a university can install, from admission through graduation. |
| [Ninefruits for Django](apps/ninefruits-django.html) | The same system on Django. The database schema matches, so an installation can move across. |
| [Solar GPS Guardian](apps/solar-gps-guardian.html) | A live public dashboard for GPS risk from space weather. |

## Local preview

Static HTML. The shared header and footer load over HTTP, so serve the folder instead of opening a file directly.

```bash
python3 -m http.server 8765
```

Open http://127.0.0.1:8765.
