<?php
class Budget {
    private $dataAccess;

    function __construct($payPeriod) {
        $this->dataAccess = new DataAccess("budget", $payPeriod);
    }

    public function get() {
        $data = $this->dataAccess->read();
        header('Content-type: application/json');
        echo $data;
    }

    public function put($parentCategory) {
        $budget = json_decode($this->dataAccess->read(), true);
        
        $request_body = file_get_contents('php://input');
        $data = json_decode($request_body, true);
        
        $category = $data["category"];
        $amount = $data["amount"];
		
		foreach ($budget[$parentCategory] as $itemCategory=>&$blueberry) {
			if ($itemCategory == $category) {
				$budget[$parentCategory][$itemCategory] = $amount;
			}
		}
		
		$this->dataAccess->write(json_encode($budget));
    }

    public function delete() {
        throw new NotImplemented("Cannot delete budget items (yet)");
    }
}
?>
