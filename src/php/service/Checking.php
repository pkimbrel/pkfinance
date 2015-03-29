<?php
class Checking {
    private $dataAccess;

    function __construct($payPeriod) {
        $this->dataAccess = DataAccess::getInstance("checking", $payPeriod);
    }

    public function get() {
        try {
            $data = $this->dataAccess->read();
        } catch (NotFound $ex) {
            $data = "{\"startingBalance\":0,\"transactions\":[]}";
            $this->dataAccess->write($data);
        }
        
        header('Content-type: application/json');
        echo $data;
    }

    public function post($tranid) {
        $transactions = json_decode($this->dataAccess->read(), true);
        
        $request_body = file_get_contents('php://input');
        $data = json_decode($request_body, true);

        $exists = false;
        		
		foreach ($transactions["transactions"] as &$transaction) {
			if ($transaction["tranid"] == $tranid) {
                $exists = true;
			}
		}
		
		if ($exists) {
            throw new DuplicateEntity("Entry already exists");
        }
		
		$data["cleared"] = ($data["cleared"] == "true");
		
		array_push($transactions["transactions"], $data);
		
		$this->dataAccess->write(json_encode($transactions));
    }
    
    public function put($tranid) {
        $transactions = json_decode($this->dataAccess->read(), true);
        
        $request_body = file_get_contents('php://input');
        $data = json_decode($request_body, true);
        
        $name = $data["field"];
        $value = $data["data"];
        		
		if ($name == "cleared") {
			$value = ($value == "true");
		}
		
		if ($name == "startingBalance") {
            $transactions["startingBalance"] = $value;
        } else if ($name == "unreconciledAmount") {
            $transactions["unreconciledAmount"] = $value;
        } else {
            foreach ($transactions["transactions"] as &$transaction) {
                if ($transaction["tranid"] == $tranid) {
                    $transaction[$name] = $value;
                }
            }
        }
		
		$this->dataAccess->write(json_encode($transactions));
    }

    public function delete($tranid) {
        $transactions = json_decode($this->dataAccess->read(), true);
        
        $deleteIndex = -1;

		foreach ($transactions["transactions"] as $index=>&$transaction) {
			if ($transaction["tranid"] == $tranid) {
				$deleteIndex = $index;
			}
		}
		
		if ($deleteIndex == -1) {
            throw new NotFound("Transaction not found");
        } else {
		    array_splice($transactions["transactions"], $deleteIndex, 1);
		}
		
		$this->dataAccess->write(json_encode($transactions));
    }
}
?>
