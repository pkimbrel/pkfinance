<?php

class BadRequest extends Exception { }
class NotFound extends Exception { }
class NotImplemented extends Exception { }
class NotAuthenticated extends Exception { }
class NotAuthorized extends Exception { }
class DuplicateEntity extends Exception { }

function exception_error_handler($errno, $errstr, $errfile, $errline ) {
    throw new ErrorException($errstr, 0, $errno, $errfile, $errline);
}
//set_error_handler("exception_error_handler", E_ERROR|E_CORE_ERROR|E_RECOVERABLE_ERROR|E_WARNING);

Service::main();

class Service {
    private static $allowedClasses = array(
        "Authenticate",
        "Budget",
        "Checking",
        "Categories",
        "FixedEvents",
        "Settings",
        "Typeahead"
    );
    
    private static $environment = "";

    public static function main() {
        try {
            Service::loadEnvironment();
            $uriData = Service::parseURI($_SERVER["REQUEST_URI"]);
            Service::checkAuthorization($uriData);
            Service::invokeMethod($uriData, strtolower($_SERVER['REQUEST_METHOD']));
        } catch (BadRequest $e) {
            echo "<strong>400</strong> - ".$e->getMessage();
            header('X-PHP-Response-Code: 400', true, 400);
        } catch (NotAuthenticated $e) {
            echo "<strong>401</strong> - ".$e->getMessage();
            header('X-PHP-Response-Code: 401', true, 401);
        } catch (NotAuthorized $e) {
            echo "<strong>403</strong> - ".$e->getMessage();
            header('X-PHP-Response-Code: 403', true, 403);
        } catch (NotFound $e) {
            echo "<strong>404</strong> - ".$e->getMessage();
            header('X-PHP-Response-Code: 404', true, 404);
        } catch (NotImplemented $e) {
            echo "<strong>405</strong> - ".$e->getMessage();
            header('X-PHP-Response-Code: 405', true, 405);
        } catch (DuplicateEntity $e) {
            echo "<strong>409</strong> - ".$e->getMessage();
            header('X-PHP-Response-Code: 409', true, 409);
        } catch (ErrorException $e) {
            echo "<strong>500</strong> - ".$e->getMessage();
            header('X-PHP-Response-Code: 500', true, 500);
        } catch (Exception $e) {
            echo "<strong>500</strong> - ".$e->getMessage();
            header('X-PHP-Response-Code: 500', true, 500);
        }
    }

    private static function checkAuthorization($uriData) {
        if ("Authenticate" != $uriData['dataSet']) {
            $headers = getallheaders();
            
            $token = @$headers['X-XSRF-TOKEN'];
            if ($token == null) {
                $token = @$headers['x-xsrf-token'];
            }
            
            if (($token == null) || ($token != "abc123")) {
                throw new NotAuthorized("Unauthorized");
            }
        }
    }

    private static function loadEnvironment() {
        $environment = @$_SERVER["PARAM1"];
        if ($environment == null) {
            $environment = "development";
        }
        
        SERVICE::$environment = $environment;

        require("dataAccess/$environment/DataAccess.php");

        foreach (Service::$allowedClasses as $className) {
            require("service/$className.php");
        }
    }

    private static function invokeMethod($uriData, $methodName) {
        $className = $uriData['dataSet'];
        Service::sanityCheck($className);

        $reflector = new ReflectionClass($className);
        $method = $reflector->getMethod($methodName);
        $class = $reflector->newInstanceArgs(array($uriData['payPeriod']));

        if ($uriData["entry"] != null) {
            $method->invoke($class, $uriData["entry"]);
        } else {
            $method->invoke($class);
        }
    }

    private static function parseURI($uri) {
        preg_match("/\\/service\\/([a-zA-Z]*)(\\/[a-zA-Z0-9\\-]*){0,1}(\\/[a-z0-9\\-]*){0,1}/", $uri, $matches);

        if (count($matches) == 2) {
            return array(
                "dataSet" => ucfirst($matches[1]),
                "payPeriod" => null,
                "entry" => null
            );
        }
        if (count($matches) == 3) {
            return array(
                "dataSet" => ucfirst($matches[1]),
                "payPeriod" => substr($matches[2], 1),
                "entry" => null
            );
        }
        if (count($matches) == 4) {
            return array(
                "dataSet" => ucfirst($matches[1]),
                "payPeriod" => substr($matches[2], 1),
                "entry" => substr($matches[3], 1)
            );
        }

        throw new BadRequest("Bad Request");
    }

    private static function sanityCheck($className) {
        if (!in_array($className, Service::$allowedClasses)) {
            throw new BadRequest ("Unknown service");
        }
    }
}

