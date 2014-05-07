<?php
class DataAccess {
    private $dataSet;
    private $payPeriod;

    function __construct($dataSet, $payPeriod) {
        $this->dataSet = $dataSet;
        $this->payPeriod = $payPeriod;
    }

    public function read() {
        $dataPath = "../../test/data/";
        if ($this->payPeriod == null) {
            $dataPath .= $this->dataSet.".json";
        } else {
            $dataPath .= $this->dataSet."/".$this->payPeriod . ".json";
        }
        $fileData = @file_get_contents($dataPath);
		if ($fileData === false) {
			throw new NotFound("Unable to read budget data for pay period: ". $this->payPeriod);
		}
        return $fileData;
    }

    public function write() {
    }

    public function delete() {
    }
}
?>
