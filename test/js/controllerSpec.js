describe('PhoneCat controllers', function () {

    describe('PhoneListCtrl', function () {
        var scope, ctrl, $httpBackend;

        beforeEach(module('phonecatApp'));

        beforeEach(inject(function (_$httpBackend_, $rootScope, $controller) {
            $httpBackend = _$httpBackend_;
            $httpBackend.expectGET('data/phones.json').
            respond([{
                name: 'Nexus S'
            }, {
                name: 'Motorola DROID'
            }]);

            scope = $rootScope.$new();
            ctrl = $controller('PhoneListCtrl', {
                $scope: scope
            });
        }));

        it('should create "phones" model with 3 phones', function () {
            expect(scope.phones).toBeUndefined();
            $httpBackend.flush();
            expect(scope.phones.length).toBe(2);
        });

        it('should default the orderProp to "age"', function () {
            expect(scope.orderProp).toBe("age");
        });
    });

});