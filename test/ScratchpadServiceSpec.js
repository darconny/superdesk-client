define([
    'jquery',
    'angular',
    'superdesk-scratchpad/services',
    'angular-mocks'
], function($, angular) {
    'use strict';

    beforeEach(function() {
        module('superdesk.scratchpad.services');
        module('ngMock');
    });

    describe('scratchpadService', function() {
        var $q, storage, server, service, httpBackend, testItem, testItem2;

        beforeEach(inject(function($injector) {
            $q = $injector.get('$q');
            storage = $injector.get('storage');
            httpBackend = $injector.get('$httpBackend');
            server = $injector.get('server');
            service = $injector.get('scratchpadService');
            testItem = {
                _links: {self: {href: 'test'}},
                data: 1
            };
            testItem2 = {
                _links: {self: {href: 'test2'}},
                data: 2
            };
            storage.clear();
            service.itemList = [];
            service.data = {};
        }));

        it('can add items', function() {
            service.addItem(testItem);
            var item = storage.getItem('scratchpad:items');
            expect(item).toEqual(['test']);
        });

        it('can remove items', function() {
            service.addItem(testItem);
            service.removeItem(testItem);
            var item = storage.getItem('scratchpad:items');
            expect(item).toEqual([]);
        });

        it('can check if item exists and return false', function() {
            var test = service.checkItemExists(testItem);
            expect(test).toEqual(false);
        });

        it('can check if item exists and return true', function() {
            service.addItem(testItem);
            var test = service.checkItemExists(testItem);
            expect(test).toEqual(true);
        });

        it('can sort items', function() {
            service.addItem(testItem);
            service.addItem(testItem2);
            service.sort([1, 0]);
            var test = storage.getItem('scratchpad:items');
            expect(test).toEqual(['test2', 'test']);
        });

        it('can get items', function() {
            var test = null;

            service.addItem(testItem);
            service.data = {};

            httpBackend
                .expectGET('http://test')
                .respond(200, testItem);

            service.getItems().then(function(response) {
                test = response[0];
            });
            httpBackend.flush();

            expect(test.data).toEqual(testItem.data);
        });

        it('can announce to listeners', function() {
            var test = false;

            service.addListener(function() {
                test = true;
            });

            expect(test).toEqual(false);

            service.addItem(testItem);

            expect(test).toEqual(true);
        });
    });
});