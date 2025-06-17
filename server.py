from http.server import BaseHTTPRequestHandler, HTTPServer
from urllib.parse import unquote_plus
import os


def get_body_params(body):
    if not body:
        return {}
    parameters = body.split("&")
    print(f"Raw parameters: {parameters}")

    def split_parameter(parameter):
        try:
            k, v = parameter.split("=", 1)
            k_escaped = unquote_plus(k)
            v_escaped = unquote_plus(v)
            print(f"Parsed parameter: {k_escaped} = {v_escaped}")
            return k_escaped, v_escaped
        except ValueError:
            print(f"Skipping invalid parameter: {parameter}")
            return None

    body_dict = dict(filter(None, map(split_parameter, parameters)))
    print(f"Parsed parameters as: {body_dict}")
    return body_dict

def submission_to_table(item):
    return f"""
    <tr>
        <td>{item.get('eventName', [''])[0]}</td>
        <td>{item.get('dayOfWeek', [''])[0]}</td>
        <td>{item.get('startTime', [''])[0]}</td>
        <td>{item.get('stopTime', [''])[0]}</td>
        <td>{item.get('phone', [''])[0]}</td>
        <td>{item.get('location', [''])[0]}</td>
        <td><a href="{item.get('eventURL', [''])[0]}">Link</a></td>
    </tr>
    """


def handle_req(url, body=None):
    url, *_ = url.split("?", 1)
    parameters = get_body_params(body)
    print(f"Received URL: {url}")
    print(f"Parameters: {parameters}")
    if url == "/myschedule.html":
        print("Serving static/html/myschedule.html")
        return open("static/html/myschedule.html").read(), "text/html"
    elif url == "/forminput.html":
        print("Serving static/html/forminput.html")
        return open("static/html/forminput.html").read(), "text/html"
    elif url == "/aboutme.html":
        print("Serving static/html/aboutme.html")
        return open("static/html/aboutme.html").read(), "text/html"
    elif url == "/stock.html":
        print("Serving static/html/stock.html")
        return open("static/html/stock.html").read(), "text/html"
    elif url.startswith("/static/css/"):
        file_path = f".{url}"
        if os.path.exists(file_path):
            return open(file_path).read(), "text/css"
    elif url.startswith("/static/js/"):
        file_path = f".{url}"
        if os.path.exists(file_path):
            return open(file_path).read(), "text/javascript"
    elif url.startswith("/static/img/"):
        file_path = f".{url}"
        if os.path.exists(file_path):
            return open(file_path, "rb").read(), "image/png"
    elif url == "/submit":
        event_data = {
            "eventName": parameters.get('eventName', [''])[0] if parameters.get('eventName') else '',
            "dayOfWeek": parameters.get('dayOfWeek', [''])[0] if parameters.get('dayOfWeek') else '',
            "startTime": parameters.get('startTime', [''])[0] if parameters.get('startTime') else '',
            "stopTime": parameters.get('stopTime', [''])[0] if parameters.get('stopTime') else '',
            "phone": parameters.get('phone', [''])[0] if parameters.get('phone') else '',
            "location": parameters.get('location', [''])[0] if parameters.get('location') else '',
            "eventURL": parameters.get('eventURL', [''])[0] if parameters.get('eventURL') else ''
        }
        return (
            f"""
            <html>
                <body>
                    <script>
                        let events = JSON.parse(localStorage.getItem("events")) || [];
                        console.log("Current events in localStorage:", events);  // Debugging line
                        events.push({event_data});
                        localStorage.setItem("events", JSON.stringify(events));
                        console.log("Updated events in localStorage:", events);  // Debugging line
                        window.location.href = "/static/html/eventlog.html";
                    </script>
                </body>
            </html>
            """,
            "text/html"
        )
    elif url == "/eventlog.html":
        return (
            """
            <!DOCTYPE html>
            <html lang="en">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>Event Submission</title>
                    <link rel="stylesheet" href="/static/css/eventlog.css"> 
                </head>
                <body>
                    <header>
                        <nav>
                            <a href="/static/html/myschedule.html">My Schedule</a>
                            <a href="/static/html/forminput.html">Form Input</a>
                            <a href="/static/html/aboutme.html">About Me</a>
                        </nav>
                    </header>
                    <h1> My New Events </h1>
                    <div>
                        <table>
                            <thead>
                                <tr>
                                    <th>Event</th>
                                    <th>Day</th>
                                    <th>Start</th>
                                    <th>End</th>
                                    <th>Phone</th>
                                    <th>Location</th>
                                    <th>URL</th>
                                </tr>
                            </thead>
                            <tbody>
                                <script>
                                    let events = JSON.parse(localStorage.getItem("events")) || [];
                                    console.log("Events in localStorage:", events);  // Debugging line
                                    events.forEach(event => {
                                        let row = document.createElement("tr");
                                        row.innerHTML = `
                                            <td>${event.eventName}</td>
                                            <td>${event.dayOfWeek}</td>
                                            <td>${event.startTime}</td>
                                            <td>${event.stopTime}</td>
                                            <td>${event.phone}</td>
                                            <td>${event.location}</td>
                                            <td><a href="${event.eventURL}">Link</a></td>
                                        `;
                                        document.querySelector("tbody").appendChild(row);
                                    });
                                </script>
                            </tbody>
                        </table>
                    </div>
                    <script src="/static/js/eventlog.js"></script>
                </body>
            </html>
            """,
            "text/html; charset=utf-8",
        )
    else:
        print(f"hittiing 404 {url}")
        return open("static/html/404.html").read(), "text/html; charset=utf-8"


# Don't change content below this. It would be best if you just left it alone.


class RequestHandler(BaseHTTPRequestHandler):
    def __c_read_body(self):
        content_length = int(self.headers.get("Content-Length", 0))
        body = self.rfile.read(content_length)
        body = str(body, encoding="utf-8")
        return body

    def __c_send_response(self, message, response_code, headers):
        # Convert the return value into a byte string for network transmission
        if type(message) == str:
            message = bytes(message, "utf8")

        # Send the first line of response.
        self.protocol_version = "HTTP/1.1"
        self.send_response(response_code)

        # Send headers (plus a few we'll handle for you)
        for key, value in headers.items():
            self.send_header(key, value)
        self.send_header("Content-Length", len(message))
        self.send_header("X-Content-Type-Options", "nosniff")
        self.end_headers()

        # Send the file.
        self.wfile.write(message)

    def do_GET(self):
        # Call the student-edited server code.
        message, content_type = handle_req(self.path)

        # Convert the return value into a byte string for network transmission
        if type(message) == str:
            message = bytes(message, "utf8")

        self.__c_send_response(
            message,
            200,
            {
                "Content-Type": content_type,
                "Content-Length": len(message),
                "X-Content-Type-Options": "nosniff",
            },
        )

    def do_POST(self):
        body = self.__c_read_body()
        message, content_type = handle_req(self.path, body)

        # Convert the return value into a byte string for network transmission
        if type(message) == str:
            message = bytes(message, "utf8")

        self.__c_send_response(
            message,
            200,
            {
                "Content-Type": content_type,
                "Content-Length": len(message),
                "X-Content-Type-Options": "nosniff",
            },
        )


def run():
    PORT = 4131
    print(f"Starting server http://localhost:{PORT}/")
    server = ("", PORT)
    httpd = HTTPServer(server, RequestHandler)
    httpd.serve_forever()


run()
