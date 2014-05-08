<?php
class Checking {
    private $dataAccess;

    function __construct($payPeriod) {
        $this->dataAccess = new DataAccess("checking", $payPeriod);
    }

    public function get() {
        $data = $this->dataAccess->read();
        header('Content-type: application/json');
        echo $data;
    }

    public function insert() {
        throw new NotImplemented("Cannot insert checking items (yet)");
    }
    
    public function post() {
        $transactions = json_decode($this->dataAccess->read(), true);
        
        $tranid = @$_POST['id'];
        $name = @$_POST['field'];
        $value = @$_POST['data'];
        		
		if ($name == "cleared") {
			$value = ($value == "true");
		}
		
		foreach ($transactions["transactions"] as &$transaction) {
			if ($transaction["tranid"] == $tranid) {
				$transaction[$name] = $value;
			}
		}
		
		$this->dataAccess->write(json_encode($transactions));
    }

    public function delete() {
        throw new NotImplemented("Cannot delete checking items (yet)");
    }
}
?>
